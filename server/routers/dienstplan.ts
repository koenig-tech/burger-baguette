import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as crypto from "crypto";
import {
  getAllEmployees, getAllEmployeesIncludingInactive,
  getEmployeeById, getEmployeeByUsername,
  createEmployee, updateEmployee, updateEmployeeLastLogin,
  getAllShiftTemplates, createShiftTemplate, deleteShiftTemplate,
  getShiftsByWeek, getShiftsByEmployee,
  createShift, updateShift, deleteShift,
  getAllAbsences, getAbsencesByEmployee,
  createAbsence, updateAbsence, deleteAbsence,
} from "../db";

const DIENSTPLAN_COOKIE = "bb_dienstplan_session";

function hashPassword(password: string): string {
  const salt = "bb-dienstplan-2026";
  return crypto.createHash("sha256").update(salt + password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function getSession(ctx: any): { userId: number; role: string; name: string } | null {
  const cookie = (ctx.req as any).cookies?.[DIENSTPLAN_COOKIE];
  if (!cookie) return null;
  try {
    const decoded = Buffer.from(cookie, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function requireSession(_ctx: any) {
  // Login deaktiviert – immer als Admin
  return { userId: 1, role: "admin" as const, name: "Admin" };
}

function requireAdmin(_ctx: any) {
  // Login deaktiviert – immer als Admin
  return { userId: 1, role: "admin" as const, name: "Admin" };
}

export const dienstplanRouter = router({
  // ── AUTH ──────────────────────────────────────────────────────────────────

  login: publicProcedure
    .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const emp = await getEmployeeByUsername(input.username);
      if (!emp || !emp.isActive) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Ungültige Anmeldedaten" });
      }
      if (!verifyPassword(input.password, emp.passwordHash)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Ungültige Anmeldedaten" });
      }
      await updateEmployeeLastLogin(emp.id);

      const sessionData = JSON.stringify({ userId: emp.id, role: emp.role, name: emp.name });
      const encoded = Buffer.from(sessionData).toString("base64");
      (ctx.res as any).cookie(DIENSTPLAN_COOKIE, encoded, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return { id: emp.id, name: emp.name, username: emp.username, role: emp.role, color: emp.color };
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    const session = getSession(ctx);
    if (!session) return null;
    const emp = await getEmployeeById(session.userId);
    if (!emp || !emp.isActive) return null;
    return { id: emp.id, name: emp.name, username: emp.username, role: emp.role, color: emp.color, position: emp.position };
  }),

  logout: publicProcedure.mutation(({ ctx }) => {
    (ctx.res as any).clearCookie(DIENSTPLAN_COOKIE, { httpOnly: true, secure: true, sameSite: "none", path: "/" });
    return { success: true };
  }),

  // Initial-Setup: ersten Admin anlegen
  setup: publicProcedure
    .input(z.object({ name: z.string().min(2), username: z.string().min(3), password: z.string().min(6) }))
    .mutation(async ({ input }) => {
      const existing = await getAllEmployeesIncludingInactive();
      if (existing.length > 0) throw new TRPCError({ code: "FORBIDDEN", message: "Setup bereits abgeschlossen" });
      await createEmployee({
        name: input.name,
        username: input.username,
        passwordHash: hashPassword(input.password),
        role: "admin",
        position: "Inhaber",
        color: "#C9A84C",
        hoursPerWeek: 40,
      });
      return { success: true };
    }),

  // ── MITARBEITER ───────────────────────────────────────────────────────────

  listEmployees: publicProcedure.query(async ({ ctx }) => {
    requireSession(ctx);
    return getAllEmployees();
  }),

  listAllEmployees: publicProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx);
    return getAllEmployeesIncludingInactive();
  }),

  createEmployee: publicProcedure
    .input(z.object({
      name: z.string().min(2).max(128),
      username: z.string().min(3).max(64),
      password: z.string().min(4),
      role: z.enum(["admin", "manager", "staff"]).default("staff"),
      position: z.string().max(64).optional(),
      color: z.string().max(16).optional(),
      phone: z.string().max(32).optional(),
      email: z.string().max(128).optional(),
      hoursPerWeek: z.number().int().min(1).max(60).default(20),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx);
      const existing = await getEmployeeByUsername(input.username);
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Benutzername bereits vergeben" });
      await createEmployee({
        name: input.name,
        username: input.username,
        passwordHash: hashPassword(input.password),
        role: input.role,
        position: input.position ?? "Servicekraft",
        color: input.color ?? "#C9A84C",
        phone: input.phone,
        email: input.email,
        hoursPerWeek: input.hoursPerWeek,
      });
      return { success: true };
    }),

  updateEmployee: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(2).max(128).optional(),
      password: z.string().min(4).optional(),
      role: z.enum(["admin", "manager", "staff"]).optional(),
      position: z.string().max(64).optional(),
      color: z.string().max(16).optional(),
      phone: z.string().max(32).optional(),
      email: z.string().max(128).optional(),
      hoursPerWeek: z.number().int().min(1).max(60).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx);
      const { id, password, ...rest } = input;
      const data: Record<string, unknown> = { ...rest };
      if (password) data.passwordHash = hashPassword(password);
      await updateEmployee(id, data as any);
      return { success: true };
    }),

  // ── SCHICHTVORLAGEN ───────────────────────────────────────────────────────

  listTemplates: publicProcedure.query(async ({ ctx }) => {
    requireSession(ctx);
    return getAllShiftTemplates();
  }),

  createTemplate: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(64),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
      color: z.string().max(16).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx);
      await createShiftTemplate({ ...input, color: input.color ?? "#C9A84C" });
      return { success: true };
    }),

  deleteTemplate: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx);
      await deleteShiftTemplate(input.id);
      return { success: true };
    }),

  // ── SCHICHTEN ─────────────────────────────────────────────────────────────

  getWeekShifts: publicProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }))
    .query(async ({ input, ctx }) => {
      requireSession(ctx);
      return getShiftsByWeek(input.startDate, input.endDate);
    }),

  getMyShifts: publicProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = requireSession(ctx);
      return getShiftsByEmployee(session.userId, input.startDate, input.endDate);
    }),

  createShift: publicProcedure
    .input(z.object({
      employeeId: z.number(),
      shiftDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
      note: z.string().max(256).optional(),
      templateId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const session = requireAdmin(ctx);
      await createShift({ ...input, shiftDate: new Date(input.shiftDate), status: "planned", createdBy: session.userId });
      return { success: true };
    }),

  updateShift: publicProcedure
    .input(z.object({
      id: z.number(),
      startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      note: z.string().max(256).optional(),
      status: z.enum(["planned", "confirmed", "cancelled"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx);
      const { id, ...data } = input;
      await updateShift(id, data as any);
      return { success: true };
    }),

  deleteShift: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx);
      await deleteShift(input.id);
      return { success: true };
    }),

  // ── ABWESENHEITEN ─────────────────────────────────────────────────────────

  getAllAbsences: publicProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx);
    return getAllAbsences();
  }),

  getMyAbsences: publicProcedure.query(async ({ ctx }) => {
    const session = requireSession(ctx);
    return getAbsencesByEmployee(session.userId);
  }),

  requestAbsence: publicProcedure
    .input(z.object({
      type: z.enum(["vacation", "sick", "other"]).default("vacation"),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      note: z.string().max(256).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const session = requireSession(ctx);
      await createAbsence({ ...input, startDate: new Date(input.startDate), endDate: new Date(input.endDate), employeeId: session.userId, status: "pending" });
      return { success: true };
    }),

  updateAbsenceStatus: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "approved", "rejected"]),
    }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx);
      await updateAbsence(input.id, { status: input.status });
      return { success: true };
    }),

  deleteAbsence: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      requireAdmin(ctx);
      await deleteAbsence(input.id);
      return { success: true };
    }),
});
