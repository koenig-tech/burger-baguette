import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar, date, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Intranet-Mitarbeiter: separate Tabelle für Intranet-Zugänge
 */
export const intranetUsers = mysqlTable("intranet_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 256 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  role: mysqlEnum("role", ["admin", "manager", "staff"]).default("staff").notNull(),
  canEditKalkulation: boolean("can_edit_kalkulation").default(false).notNull(),
  canEditRezepte: boolean("can_edit_rezepte").default(false).notNull(),
  canEditFinanzen: boolean("can_edit_finanzen").default(false).notNull(),
  canEditDashboard: boolean("can_edit_dashboard").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  lastLogin: timestamp("last_login"),
});

export type IntranetUser = typeof intranetUsers.$inferSelect;
export type InsertIntranetUser = typeof intranetUsers.$inferInsert;

/**
 * Audit-Log
 */
export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  userName: varchar("user_name", { length: 128 }).notNull(),
  userRole: varchar("user_role", { length: 32 }).notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  section: varchar("section", { length: 128 }).notNull(),
  field: varchar("field", { length: 256 }),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

/**
 * ── DIENSTPLAN ────────────────────────────────────────────────────────────────
 * Mitarbeiter-Profil (für den Dienstplan – unabhängig von intranetUsers)
 */
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 256 }).notNull(),
  role: mysqlEnum("role", ["admin", "manager", "staff"]).default("staff").notNull(),
  position: varchar("position", { length: 64 }).default("Servicekraft"),
  color: varchar("color", { length: 16 }).default("#C9A84C"),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 128 }),
  hoursPerWeek: int("hours_per_week").default(20),
  hourlyWage: decimal("hourly_wage", { precision: 8, scale: 2 }).default("12.41"),  // Stundenlohn
  taxClass: mysqlEnum("tax_class", ["1","2","3","4","5","6"]).default("1"),          // Steuerklasse
  socialSecurityNumber: varchar("social_security_number", { length: 32 }),           // Sozialversicherungsnummer
  iban: varchar("iban", { length: 34 }),                                              // IBAN für Lohn
  contractType: mysqlEnum("contract_type", ["vollzeit","teilzeit","minijob","aushilfe"]).default("minijob"),
  contractStart: date("contract_start"),
  contractEnd: date("contract_end"),
  address: varchar("address", { length: 256 }),
  birthDate: date("birth_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  lastLogin: timestamp("last_login"),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Schichtvorlagen (z.B. Frühschicht 09:00–15:00)
 */
export const shiftTemplates = mysqlTable("shift_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  startTime: varchar("start_time", { length: 8 }).notNull(),
  endTime: varchar("end_time", { length: 8 }).notNull(),
  color: varchar("color", { length: 16 }).default("#C9A84C"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ShiftTemplate = typeof shiftTemplates.$inferSelect;
export type InsertShiftTemplate = typeof shiftTemplates.$inferInsert;

/**
 * Dienstplan-Einträge (konkrete Schichten)
 */
export const shifts = mysqlTable("shifts", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employee_id").notNull(),
  shiftDate: date("shift_date").notNull(),
  startTime: varchar("start_time", { length: 8 }).notNull(),
  endTime: varchar("end_time", { length: 8 }).notNull(),
  note: varchar("note", { length: 256 }),
  status: mysqlEnum("status", ["planned", "confirmed", "cancelled"]).default("planned").notNull(),
  templateId: int("template_id"),
  createdBy: int("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Shift = typeof shifts.$inferSelect;
export type InsertShift = typeof shifts.$inferInsert;

/**
 * Urlaubsanträge / Abwesenheiten
 */
export const absences = mysqlTable("absences", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employee_id").notNull(),
  type: mysqlEnum("type", ["vacation", "sick", "other"]).default("vacation").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  note: varchar("note", { length: 256 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Absence = typeof absences.$inferSelect;
export type InsertAbsence = typeof absences.$inferInsert;

/**
 * ── LOHNABRECHNUNG ────────────────────────────────────────────────────────────
 * Monatliche Lohnabrechnungen pro Mitarbeiter
 */
export const payrollRecords = mysqlTable("payroll_records", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employee_id").notNull(),
  month: int("month").notNull(),          // 1–12
  year: int("year").notNull(),            // z.B. 2026
  hoursWorked: decimal("hours_worked", { precision: 8, scale: 2 }).default("0"),
  hourlyWage: decimal("hourly_wage", { precision: 8, scale: 2 }).notNull(),
  grossSalary: decimal("gross_salary", { precision: 10, scale: 2 }).notNull(),
  taxDeduction: decimal("tax_deduction", { precision: 10, scale: 2 }).default("0"),
  socialSecurity: decimal("social_security", { precision: 10, scale: 2 }).default("0"),
  otherDeductions: decimal("other_deductions", { precision: 10, scale: 2 }).default("0"),
  netSalary: decimal("net_salary", { precision: 10, scale: 2 }).notNull(),
  bonus: decimal("bonus", { precision: 10, scale: 2 }).default("0"),
  vacationDays: int("vacation_days").default(0),
  sickDays: int("sick_days").default(0),
  status: mysqlEnum("status", ["draft", "finalized", "paid"]).default("draft").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PayrollRecord = typeof payrollRecords.$inferSelect;
export type InsertPayrollRecord = typeof payrollRecords.$inferInsert;

/**
 * ── PERSONALDOKUMENTE ─────────────────────────────────────────────────────────
 * Digitale Personalakte: Dokumente pro Mitarbeiter
 */
export const personalDocuments = mysqlTable("personal_documents", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employee_id").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  category: mysqlEnum("category", [
    "vertrag",        // Arbeitsvertrag
    "zeugnis",        // Arbeitszeugnis
    "ausweis",        // Personalausweis / Reisepass
    "krankmeldung",   // Krankmeldung / AU
    "lohnabrechnung", // Lohnabrechnung PDF
    "sonstiges"       // Sonstiges
  ]).default("sonstiges").notNull(),
  fileUrl: varchar("file_url", { length: 512 }),     // S3 URL
  fileKey: varchar("file_key", { length: 512 }),     // S3 Key
  mimeType: varchar("mime_type", { length: 64 }),
  fileSize: int("file_size"),                         // Bytes
  notes: text("notes"),
  uploadedBy: int("uploaded_by").notNull(),           // employee.id des Uploaders
  signedByEmployee: boolean("signed_by_employee").default(false).notNull(),
  signedByAdmin: boolean("signed_by_admin").default(false).notNull(),
  signedAt: timestamp("signed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PersonalDocument = typeof personalDocuments.$inferSelect;
export type InsertPersonalDocument = typeof personalDocuments.$inferInsert;
