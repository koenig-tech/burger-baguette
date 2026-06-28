import { COOKIE_NAME } from "@shared/const";
import { dienstplanRouter } from "./routers/dienstplan";
import { payrollRouter, documentsRouter } from "./routers/payroll";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllIntranetUsers,
  getIntranetUserByUsername,
  getIntranetUserById,
  createIntranetUser,
  updateIntranetUser,
  deleteIntranetUser,
  updateIntranetUserLastLogin,
  createAuditEntry,
  getAuditLog,
  getAuditLogByUser,
} from "./db";
import { TRPCError } from "@trpc/server";
import * as crypto from "crypto";

// Simple password hashing using SHA-256 + salt
function hashPassword(password: string): string {
  const salt = "bb-intranet-2024";
  return crypto.createHash("sha256").update(salt + password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Intranet session cookie name
const INTRANET_COOKIE = "bb_intranet_session";

export const appRouter = router({
  system: systemRouter,
  dienstplan: dienstplanRouter,
  payroll: payrollRouter,
  documents: documentsRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================================
  // INTRANET AUTH
  // ============================================================
  intranet: router({
    /**
     * Login mit Username + Passwort
     */
    login: publicProcedure
      .input(z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await getIntranetUserByUsername(input.username);
        if (!user || !user.isActive) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Ungültige Anmeldedaten" });
        }
        if (!verifyPassword(input.password, user.passwordHash)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Ungültige Anmeldedaten" });
        }
        await updateIntranetUserLastLogin(user.id);

        // Session als JSON-Cookie setzen (7 Tage)
        const sessionData = JSON.stringify({ userId: user.id, role: user.role, name: user.name });
        const encoded = Buffer.from(sessionData).toString("base64");
        ctx.res.cookie(INTRANET_COOKIE, encoded, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          canEditKalkulation: user.canEditKalkulation,
          canEditRezepte: user.canEditRezepte,
          canEditFinanzen: user.canEditFinanzen,
          canEditDashboard: user.canEditDashboard,
        };
      }),

    /**
     * Aktuelle Session prüfen
     */
    me: publicProcedure.query(async ({ ctx }) => {
      const cookie = (ctx.req as any).cookies?.[INTRANET_COOKIE];
      if (!cookie) return null;
      try {
        const decoded = Buffer.from(cookie, "base64").toString("utf-8");
        const session = JSON.parse(decoded) as { userId: number; role: string; name: string };
        const user = await getIntranetUserById(session.userId);
        if (!user || !user.isActive) return null;
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          canEditKalkulation: user.canEditKalkulation,
          canEditRezepte: user.canEditRezepte,
          canEditFinanzen: user.canEditFinanzen,
          canEditDashboard: user.canEditDashboard,
        };
      } catch {
        return null;
      }
    }),

    /**
     * Logout
     */
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(INTRANET_COOKIE, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      return { success: true };
    }),

    // ============================================================
    // BENUTZERVERWALTUNG (nur Admin)
    // ============================================================

    /**
     * Alle Mitarbeiter auflisten
     */
    listUsers: publicProcedure.query(async ({ ctx }) => {
      const cookie = (ctx.req as any).cookies?.[INTRANET_COOKIE];
      if (!cookie) throw new TRPCError({ code: "UNAUTHORIZED" });
      const decoded = Buffer.from(cookie, "base64").toString("utf-8");
      const session = JSON.parse(decoded) as { userId: number; role: string };
      if (session.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return getAllIntranetUsers();
    }),

    /**
     * Neuen Mitarbeiter anlegen (nur Admin)
     */
    createUser: publicProcedure
      .input(z.object({
        username: z.string().min(3).max(64),
        password: z.string().min(6),
        name: z.string().min(2).max(128),
        role: z.enum(["admin", "manager", "staff"]),
        canEditKalkulation: z.boolean().default(false),
        canEditRezepte: z.boolean().default(false),
        canEditFinanzen: z.boolean().default(false),
        canEditDashboard: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        const cookie = (ctx.req as any).cookies?.[INTRANET_COOKIE];
        if (!cookie) throw new TRPCError({ code: "UNAUTHORIZED" });
        const decoded = Buffer.from(cookie, "base64").toString("utf-8");
        const session = JSON.parse(decoded) as { userId: number; role: string; name: string };
        if (session.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

        // Prüfe ob Username bereits existiert
        const existing = await getIntranetUserByUsername(input.username);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Benutzername bereits vergeben" });
        }

        await createIntranetUser({
          username: input.username,
          passwordHash: hashPassword(input.password),
          name: input.name,
          role: input.role,
          canEditKalkulation: input.canEditKalkulation,
          canEditRezepte: input.canEditRezepte,
          canEditFinanzen: input.canEditFinanzen,
          canEditDashboard: input.canEditDashboard,
        });

        // Audit-Log
        await createAuditEntry({
          userId: session.userId,
          userName: session.name,
          userRole: session.role,
          action: "create",
          section: "Benutzerverwaltung",
          field: "Neuer Benutzer",
          newValue: `${input.name} (${input.username}) - Rolle: ${input.role}`,
        });

        return { success: true };
      }),

    /**
     * Mitarbeiter aktualisieren (nur Admin)
     */
    updateUser: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(2).max(128).optional(),
        password: z.string().min(6).optional(),
        role: z.enum(["admin", "manager", "staff"]).optional(),
        canEditKalkulation: z.boolean().optional(),
        canEditRezepte: z.boolean().optional(),
        canEditFinanzen: z.boolean().optional(),
        canEditDashboard: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const cookie = (ctx.req as any).cookies?.[INTRANET_COOKIE];
        if (!cookie) throw new TRPCError({ code: "UNAUTHORIZED" });
        const decoded = Buffer.from(cookie, "base64").toString("utf-8");
        const session = JSON.parse(decoded) as { userId: number; role: string; name: string };
        if (session.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

        const { id, password, ...rest } = input;
        const updateData: Record<string, unknown> = { ...rest };
        if (password) {
          updateData.passwordHash = hashPassword(password);
        }

        await updateIntranetUser(id, updateData as any);

        // Audit-Log
        await createAuditEntry({
          userId: session.userId,
          userName: session.name,
          userRole: session.role,
          action: "update",
          section: "Benutzerverwaltung",
          field: `Benutzer ID ${id}`,
          newValue: JSON.stringify(rest),
        });

        return { success: true };
      }),

    /**
     * Mitarbeiter deaktivieren (nur Admin)
     */
    deactivateUser: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const cookie = (ctx.req as any).cookies?.[INTRANET_COOKIE];
        if (!cookie) throw new TRPCError({ code: "UNAUTHORIZED" });
        const decoded = Buffer.from(cookie, "base64").toString("utf-8");
        const session = JSON.parse(decoded) as { userId: number; role: string; name: string };
        if (session.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        if (input.id === session.userId) throw new TRPCError({ code: "BAD_REQUEST", message: "Eigenen Account nicht deaktivierbar" });

        await updateIntranetUser(input.id, { isActive: false });

        await createAuditEntry({
          userId: session.userId,
          userName: session.name,
          userRole: session.role,
          action: "deactivate",
          section: "Benutzerverwaltung",
          field: `Benutzer ID ${input.id}`,
        });

        return { success: true };
      }),

    // ============================================================
    // AUDIT LOG
    // ============================================================

    /**
     * Audit-Log abrufen (Admin: alle, Manager/Staff: nur eigene)
     */
    getAuditLog: publicProcedure
      .input(z.object({ limit: z.number().default(100) }).optional())
      .query(async ({ input, ctx }) => {
        const cookie = (ctx.req as any).cookies?.[INTRANET_COOKIE];
        if (!cookie) throw new TRPCError({ code: "UNAUTHORIZED" });
        const decoded = Buffer.from(cookie, "base64").toString("utf-8");
        const session = JSON.parse(decoded) as { userId: number; role: string };
        const limit = input?.limit ?? 100;

        if (session.role === "admin") {
          return getAuditLog(limit);
        } else {
          return getAuditLogByUser(session.userId, limit);
        }
      }),

    /**
     * Änderung protokollieren (aus dem Intranet-Frontend)
     */
    logChange: publicProcedure
      .input(z.object({
        action: z.string(),
        section: z.string(),
        field: z.string().optional(),
        oldValue: z.string().optional(),
        newValue: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const cookie = (ctx.req as any).cookies?.[INTRANET_COOKIE];
        if (!cookie) throw new TRPCError({ code: "UNAUTHORIZED" });
        const decoded = Buffer.from(cookie, "base64").toString("utf-8");
        const session = JSON.parse(decoded) as { userId: number; role: string; name: string };

        await createAuditEntry({
          userId: session.userId,
          userName: session.name,
          userRole: session.role,
          action: input.action,
          section: input.section,
          field: input.field,
          oldValue: input.oldValue,
          newValue: input.newValue,
        });

        return { success: true };
      }),

    /**
     * Initial-Setup: Ersten Admin-Account anlegen (nur wenn noch keine User existieren)
     */
    setupAdmin: publicProcedure
      .input(z.object({
        username: z.string().min(3),
        password: z.string().min(6),
        name: z.string().min(2),
      }))
      .mutation(async ({ input }) => {
        const existing = await getAllIntranetUsers();
        if (existing.length > 0) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Setup bereits abgeschlossen" });
        }

        await createIntranetUser({
          username: input.username,
          passwordHash: hashPassword(input.password),
          name: input.name,
          role: "admin",
          canEditKalkulation: true,
          canEditRezepte: true,
          canEditFinanzen: true,
          canEditDashboard: true,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
