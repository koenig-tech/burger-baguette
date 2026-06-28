import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getAllEmployees,
  getPayrollByEmployee,
  getAllPayrollRecords,
  getPayrollById,
  createPayrollRecord,
  updatePayrollRecord,
  deletePayrollRecord,
  getDocumentsByEmployee,
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getShiftsByWeek,
  getEmployeeById,
} from "../db";

// ── LOHNABRECHNUNG ────────────────────────────────────────────────────────────

export const payrollRouter = router({

  // Alle Abrechnungen (Admin-Übersicht)
  listAll: publicProcedure
    .input(z.object({ year: z.number().optional(), month: z.number().min(1).max(12).optional() }))
    .query(async ({ input }) => {
      return getAllPayrollRecords(input.year, input.month);
    }),

  // Abrechnungen eines Mitarbeiters
  listByEmployee: publicProcedure
    .input(z.object({ employeeId: z.number() }))
    .query(async ({ input }) => {
      return getPayrollByEmployee(input.employeeId);
    }),

  // Abrechnung abrufen
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const record = await getPayrollById(input.id);
      if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "Abrechnung nicht gefunden" });
      return record;
    }),

  // Abrechnung automatisch aus Schichten berechnen
  calculate: publicProcedure
    .input(z.object({ employeeId: z.number(), month: z.number().min(1).max(12), year: z.number() }))
    .mutation(async ({ input }) => {
      const emp = await getEmployeeById(input.employeeId);
      if (!emp) throw new TRPCError({ code: "NOT_FOUND", message: "Mitarbeiter nicht gefunden" });

      // Schichten des Monats laden
      const firstDay = `${input.year}-${String(input.month).padStart(2, "0")}-01`;
      const lastDay = new Date(input.year, input.month, 0);
      const lastDayStr = `${input.year}-${String(input.month).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;
      const shifts = await getShiftsByWeek(firstDay, lastDayStr);
      const myShifts = shifts.filter(s => s.employeeId === input.employeeId);

      // Stunden berechnen
      let totalHours = 0;
      for (const shift of myShifts) {
        const [sh, sm] = shift.startTime.split(":").map(Number);
        const [eh, em] = shift.endTime.split(":").map(Number);
        totalHours += (eh * 60 + em - sh * 60 - sm) / 60;
      }

      const hourlyWage = parseFloat(emp.hourlyWage ?? "12.41");
      const grossSalary = Math.round(totalHours * hourlyWage * 100) / 100;

      // Steuer & SV vereinfacht (Minijob: keine Abzüge bis 556€)
      let taxDeduction = 0;
      let socialSecurity = 0;
      if (emp.contractType !== "minijob" && grossSalary > 556) {
        taxDeduction = Math.round(grossSalary * 0.15 * 100) / 100;  // ~15% Lohnsteuer
        socialSecurity = Math.round(grossSalary * 0.2025 * 100) / 100; // ~20.25% AN-Anteil
      }
      const netSalary = Math.round((grossSalary - taxDeduction - socialSecurity) * 100) / 100;

      return {
        employeeId: input.employeeId,
        month: input.month,
        year: input.year,
        hoursWorked: String(Math.round(totalHours * 100) / 100),
        hourlyWage: String(hourlyWage),
        grossSalary: String(grossSalary),
        taxDeduction: String(taxDeduction),
        socialSecurity: String(socialSecurity),
        otherDeductions: "0",
        netSalary: String(netSalary),
        bonus: "0",
        shiftsCount: myShifts.length,
      };
    }),

  // Abrechnung speichern/erstellen
  create: publicProcedure
    .input(z.object({
      employeeId: z.number(),
      month: z.number().min(1).max(12),
      year: z.number(),
      hoursWorked: z.string(),
      hourlyWage: z.string(),
      grossSalary: z.string(),
      taxDeduction: z.string().optional(),
      socialSecurity: z.string().optional(),
      otherDeductions: z.string().optional(),
      netSalary: z.string(),
      bonus: z.string().optional(),
      vacationDays: z.number().optional(),
      sickDays: z.number().optional(),
      notes: z.string().optional(),
      status: z.enum(["draft", "finalized", "paid"]).optional(),
    }))
    .mutation(async ({ input }) => {
      await createPayrollRecord({
        ...input,
        status: input.status ?? "draft",
      });
      return { success: true };
    }),

  // Abrechnung aktualisieren
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["draft", "finalized", "paid"]).optional(),
      bonus: z.string().optional(),
      notes: z.string().optional(),
      netSalary: z.string().optional(),
      grossSalary: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updatePayrollRecord(id, data as any);
      return { success: true };
    }),

  // Abrechnung löschen
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deletePayrollRecord(input.id);
      return { success: true };
    }),

  // Alle Mitarbeiter für Dropdown
  listEmployees: publicProcedure.query(async () => {
    return getAllEmployees();
  }),
});

// ── PERSONALDOKUMENTE ─────────────────────────────────────────────────────────

export const documentsRouter = router({

  // Alle Dokumente (Admin)
  listAll: publicProcedure.query(async () => {
    return getAllDocuments();
  }),

  // Dokumente eines Mitarbeiters
  listByEmployee: publicProcedure
    .input(z.object({ employeeId: z.number() }))
    .query(async ({ input }) => {
      return getDocumentsByEmployee(input.employeeId);
    }),

  // Dokument abrufen
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const doc = await getDocumentById(input.id);
      if (!doc) throw new TRPCError({ code: "NOT_FOUND", message: "Dokument nicht gefunden" });
      return doc;
    }),

  // Dokument anlegen (ohne Datei-Upload – URL wird direkt übergeben)
  create: publicProcedure
    .input(z.object({
      employeeId: z.number(),
      title: z.string().min(1).max(256),
      category: z.enum(["vertrag", "zeugnis", "ausweis", "krankmeldung", "lohnabrechnung", "sonstiges"]),
      fileUrl: z.string().url().optional(),
      fileKey: z.string().optional(),
      mimeType: z.string().optional(),
      fileSize: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await createDocument({
        ...input,
        uploadedBy: 1, // Admin (Login deaktiviert)
      });
      return { success: true };
    }),

  // Dokument aktualisieren
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      category: z.enum(["vertrag", "zeugnis", "ausweis", "krankmeldung", "lohnabrechnung", "sonstiges"]).optional(),
      notes: z.string().optional(),
      signedByEmployee: z.boolean().optional(),
      signedByAdmin: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.signedByAdmin || data.signedByEmployee) {
        updateData.signedAt = new Date();
      }
      await updateDocument(id, updateData as any);
      return { success: true };
    }),

  // Dokument löschen
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteDocument(input.id);
      return { success: true };
    }),

  // Alle Mitarbeiter für Dropdown
  listEmployees: publicProcedure.query(async () => {
    return getAllEmployees();
  }),
});
