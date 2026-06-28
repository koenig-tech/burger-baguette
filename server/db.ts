import { and, desc, eq, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  intranetUsers, auditLog, InsertIntranetUser, InsertAuditLog,
  employees, InsertEmployee, Employee,
  shiftTemplates, InsertShiftTemplate,
  shifts, InsertShift,
  absences, InsertAbsence,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── INTRANET USER FUNCTIONS ──────────────────────────────────────────────────

export async function getAllIntranetUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(intranetUsers).orderBy(intranetUsers.name);
}

export async function getIntranetUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(intranetUsers).where(eq(intranetUsers.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getIntranetUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(intranetUsers).where(eq(intranetUsers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createIntranetUser(user: InsertIntranetUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(intranetUsers).values(user);
}

export async function updateIntranetUser(id: number, data: Partial<InsertIntranetUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(intranetUsers).set(data).where(eq(intranetUsers.id, id));
}

export async function deleteIntranetUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(intranetUsers).where(eq(intranetUsers.id, id));
}

export async function updateIntranetUserLastLogin(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(intranetUsers).set({ lastLogin: new Date() }).where(eq(intranetUsers.id, id));
}

// ── AUDIT LOG ────────────────────────────────────────────────────────────────

export async function createAuditEntry(entry: InsertAuditLog) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditLog).values(entry);
}

export async function getAuditLog(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(limit);
}

export async function getAuditLogByUser(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLog).where(eq(auditLog.userId, userId)).orderBy(desc(auditLog.createdAt)).limit(limit);
}

// ── DIENSTPLAN: EMPLOYEES ────────────────────────────────────────────────────

export async function getAllEmployees(): Promise<Employee[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(employees).where(eq(employees.isActive, true)).orderBy(employees.name);
}

export async function getAllEmployeesIncludingInactive(): Promise<Employee[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(employees).orderBy(employees.name);
}

export async function getEmployeeById(id: number): Promise<Employee | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeeByUsername(username: string): Promise<Employee | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employees).where(eq(employees.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEmployee(emp: InsertEmployee) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(employees).values(emp);
}

export async function updateEmployee(id: number, data: Partial<InsertEmployee>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(employees).set(data).where(eq(employees.id, id));
}

export async function updateEmployeeLastLogin(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(employees).set({ lastLogin: new Date() }).where(eq(employees.id, id));
}

// ── DIENSTPLAN: SHIFT TEMPLATES ──────────────────────────────────────────────

export async function getAllShiftTemplates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shiftTemplates).orderBy(shiftTemplates.startTime);
}

export async function createShiftTemplate(tmpl: InsertShiftTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(shiftTemplates).values(tmpl);
}

export async function deleteShiftTemplate(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(shiftTemplates).where(eq(shiftTemplates.id, id));
}

// ── DIENSTPLAN: SHIFTS ───────────────────────────────────────────────────────

export async function getShiftsByWeek(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shifts)
    .where(and(gte(shifts.shiftDate, new Date(startDate)), lte(shifts.shiftDate, new Date(endDate))))
    .orderBy(shifts.shiftDate, shifts.startTime);
}

export async function getShiftsByEmployee(employeeId: number, startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shifts)
    .where(and(
      eq(shifts.employeeId, employeeId),
      gte(shifts.shiftDate, new Date(startDate)),
      lte(shifts.shiftDate, new Date(endDate))
    ))
    .orderBy(shifts.shiftDate, shifts.startTime);
}

export async function createShift(shift: InsertShift) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(shifts).values(shift);
  return result;
}

export async function updateShift(id: number, data: Partial<InsertShift>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(shifts).set(data).where(eq(shifts.id, id));
}

export async function deleteShift(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(shifts).where(eq(shifts.id, id));
}

// ── DIENSTPLAN: ABSENCES ─────────────────────────────────────────────────────

export async function getAbsencesByEmployee(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(absences).where(eq(absences.employeeId, employeeId)).orderBy(desc(absences.startDate));
}

export async function getAllAbsences() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(absences).orderBy(desc(absences.startDate));
}

export async function createAbsence(absence: InsertAbsence) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(absences).values(absence);
}

export async function updateAbsence(id: number, data: Partial<InsertAbsence>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(absences).set(data).where(eq(absences.id, id));
}

export async function deleteAbsence(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(absences).where(eq(absences.id, id));
}

// ── LOHNABRECHNUNG ────────────────────────────────────────────────────────────

import { payrollRecords, InsertPayrollRecord, personalDocuments, InsertPersonalDocument } from "../drizzle/schema";

export async function getPayrollByEmployee(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payrollRecords)
    .where(eq(payrollRecords.employeeId, employeeId))
    .orderBy(desc(payrollRecords.year), desc(payrollRecords.month));
}

export async function getAllPayrollRecords(year?: number, month?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (year) conditions.push(eq(payrollRecords.year, year));
  if (month) conditions.push(eq(payrollRecords.month, month));
  const query = conditions.length > 0
    ? db.select().from(payrollRecords).where(and(...conditions))
    : db.select().from(payrollRecords);
  return query.orderBy(desc(payrollRecords.year), desc(payrollRecords.month), payrollRecords.employeeId);
}

export async function getPayrollById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(payrollRecords).where(eq(payrollRecords.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPayrollRecord(record: InsertPayrollRecord) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(payrollRecords).values(record);
}

export async function updatePayrollRecord(id: number, data: Partial<InsertPayrollRecord>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(payrollRecords).set(data).where(eq(payrollRecords.id, id));
}

export async function deletePayrollRecord(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(payrollRecords).where(eq(payrollRecords.id, id));
}

// ── PERSONALDOKUMENTE ─────────────────────────────────────────────────────────

export async function getDocumentsByEmployee(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(personalDocuments)
    .where(eq(personalDocuments.employeeId, employeeId))
    .orderBy(desc(personalDocuments.createdAt));
}

export async function getAllDocuments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(personalDocuments).orderBy(desc(personalDocuments.createdAt));
}

export async function getDocumentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(personalDocuments).where(eq(personalDocuments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDocument(doc: InsertPersonalDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(personalDocuments).values(doc);
}

export async function updateDocument(id: number, data: Partial<InsertPersonalDocument>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(personalDocuments).set(data).where(eq(personalDocuments.id, id));
}

export async function deleteDocument(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(personalDocuments).where(eq(personalDocuments.id, id));
}
