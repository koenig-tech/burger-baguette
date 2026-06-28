import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft, ChevronRight, Plus, Trash2, LogOut, Users, Calendar,
  Clock, Edit2, Check, X, UserPlus, Settings, Plane, HeartPulse, ClipboardList,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getWeekDates(weekOffset: number) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatDateDE(d: Date) {
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function calcHours(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return ((eh * 60 + em) - (sh * 60 + sm)) / 60;
}

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const COLORS = ["#C9A84C", "#E74C3C", "#3498DB", "#2ECC71", "#9B59B6", "#E67E22", "#1ABC9C", "#E91E63"];

// ── Main Component ────────────────────────────────────────────────────────────

export default function Dienstplan() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeTab, setActiveTab] = useState<"plan" | "employees" | "absences" | "settings">("plan");
  const [showAddShift, setShowAddShift] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [setupData] = useState({ name: "", username: "admin", password: "" });
  const [newShift, setNewShift] = useState({ employeeId: 0, shiftDate: "", startTime: "09:00", endTime: "17:00", note: "", templateId: 0 });
  const [newEmployee, setNewEmployee] = useState({ name: "", username: "", password: "", role: "staff" as "admin" | "manager" | "staff", position: "Servicekraft", color: "#C9A84C", hoursPerWeek: 20 });
  const [editShiftId, setEditShiftId] = useState<number | null>(null);
  const [editShiftData, setEditShiftData] = useState({ startTime: "", endTime: "", note: "" });

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const startDate = formatDate(weekDates[0]);
  const endDate = formatDate(weekDates[6]);

  // ── Queries ──
  const employeesQuery = trpc.dienstplan.listEmployees.useQuery(undefined, {});
  const allEmployeesQuery = trpc.dienstplan.listAllEmployees.useQuery(undefined, {});
  const weekShiftsQuery = trpc.dienstplan.getWeekShifts.useQuery(
    { startDate, endDate },
    {}
  );
  const myShiftsQuery = trpc.dienstplan.getMyShifts.useQuery(
    { startDate, endDate },
    {}
  );
  const absencesQuery = trpc.dienstplan.getAllAbsences.useQuery(undefined, {
    enabled: true,
  });
  const myAbsencesQuery = trpc.dienstplan.getMyAbsences.useQuery(undefined, {});
  const templatesQuery = trpc.dienstplan.listTemplates.useQuery(undefined, {});

  // ── Mutations ──
  const utils = trpc.useUtils();
  const loginMut = trpc.dienstplan.login.useMutation({
    onSuccess: () => { utils.dienstplan.listEmployees.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const logoutMut = trpc.dienstplan.logout.useMutation({
    onSuccess: () => { utils.dienstplan.listEmployees.invalidate(); },
  });
  const setupMut = trpc.dienstplan.setup.useMutation({
    onSuccess: () => { toast.success("Admin angelegt! Bitte jetzt anmelden."); setShowSetup(false); },
    onError: (e) => toast.error(e.message),
  });
  const createShiftMut = trpc.dienstplan.createShift.useMutation({
    onSuccess: () => { utils.dienstplan.getWeekShifts.invalidate(); setShowAddShift(false); toast.success("Schicht erstellt"); },
    onError: (e) => toast.error(e.message),
  });
  const deleteShiftMut = trpc.dienstplan.deleteShift.useMutation({
    onSuccess: () => { utils.dienstplan.getWeekShifts.invalidate(); toast.success("Schicht gelöscht"); },
  });
  const updateShiftMut = trpc.dienstplan.updateShift.useMutation({
    onSuccess: () => { utils.dienstplan.getWeekShifts.invalidate(); setEditShiftId(null); },
  });
  const createEmployeeMut = trpc.dienstplan.createEmployee.useMutation({
    onSuccess: () => { utils.dienstplan.listAllEmployees.invalidate(); utils.dienstplan.listEmployees.invalidate(); setShowAddEmployee(false); toast.success("Mitarbeiter angelegt"); },
    onError: (e) => toast.error(e.message),
  });
  const updateEmployeeMut = trpc.dienstplan.updateEmployee.useMutation({
    onSuccess: () => { utils.dienstplan.listAllEmployees.invalidate(); utils.dienstplan.listEmployees.invalidate(); toast.success("Gespeichert"); },
  });
  const requestAbsenceMut = trpc.dienstplan.requestAbsence.useMutation({
    onSuccess: () => { utils.dienstplan.getMyAbsences.invalidate(); toast.success("Antrag gestellt"); },
  });
  const updateAbsenceMut = trpc.dienstplan.updateAbsenceStatus.useMutation({
    onSuccess: () => { utils.dienstplan.getAllAbsences.invalidate(); },
  });

  const isAdmin = true; // Login deaktiviert – voller Admin-Zugang
  const shifts = weekShiftsQuery.data ?? [];
  const employees = employeesQuery.data ?? [];
  const allEmployees = allEmployeesQuery.data ?? [];
  const templates = templatesQuery.data ?? [];

  // Schichten pro Mitarbeiter pro Tag
  function getShiftsForCell(empId: number, date: string) {
    return shifts.filter(s => {
      const d = s.shiftDate instanceof Date ? s.shiftDate.toISOString().split('T')[0] : String(s.shiftDate);
      return s.employeeId === empId && d === date;
    });
  }

  // Wochenstunden pro Mitarbeiter
  function getWeekHours(empId: number) {
    return shifts
      .filter(s => s.employeeId === empId && s.status !== "cancelled")
      .reduce((sum, s) => sum + calcHours(s.startTime ?? "00:00", s.endTime ?? "00:00"), 0);
  }

  // Login deaktiviert – kein Passwortschutz

  // ── Main App ──────────────────────────────────────────────────────────────
  return (
    <div className="dienstplan-shell" style={{ minHeight: "100vh", background: "#120A00", color: "#E8DCC8", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div className="dienstplan-header" style={{ background: "#1E1209", borderBottom: "1px solid rgba(201,168,76,0.3)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>📅</span>
          <div>
            <div style={{ color: "#C9A84C", fontWeight: 700, fontSize: 18 }}>Dienstplan</div>
            <div style={{ color: "#888", fontSize: 12 }}>Burger & Baguette Foodtruck</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#E8DCC8", fontSize: 14, fontWeight: 600 }}>Burger & Baguette</div>
            <div style={{ color: "#888", fontSize: 11 }}>Administrator</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dienstplan-tabs" style={{ background: "#1E1209", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "0 24px", display: "flex", gap: 4 }}>
        {[
          { id: "plan", icon: <Calendar size={14} />, label: "Wochenplan" },
          ...(isAdmin ? [{ id: "employees", icon: <Users size={14} />, label: "Mitarbeiter" }] : []),
          { id: "absences", icon: <Clock size={14} />, label: "Abwesenheiten" },
          ...(isAdmin ? [{ id: "settings", icon: <Settings size={14} />, label: "Schichtvorlagen" }] : []),
        ].map(tab => (
          <button
            key={tab.id}
            className="dienstplan-tab-button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "12px 16px", background: "none", border: "none", cursor: "pointer",
              color: activeTab === tab.id ? "#C9A84C" : "#888",
              borderBottom: activeTab === tab.id ? "2px solid #C9A84C" : "2px solid transparent",
              display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400,
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="dienstplan-content" style={{ padding: 24 }}>

        {/* ── WOCHENPLAN ── */}
        {activeTab === "plan" && (
          <div>
            {/* Week navigation */}
            <div className="dienstplan-weekbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div className="dienstplan-week-controls" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Button variant="outline" size="sm" onClick={() => setWeekOffset(p => p - 1)} style={{ borderColor: "rgba(201,168,76,0.3)", color: "#C9A84C" }}>
                  <ChevronLeft size={16} />
                </Button>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#C9A84C", fontWeight: 700, fontSize: 16 }}>
                    KW {Math.ceil((weekDates[0].getTime() - new Date(weekDates[0].getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1} {weekDates[0].getFullYear()}
                  </div>
                  <div style={{ color: "#888", fontSize: 12 }}>
                    {formatDateDE(weekDates[0])} – {formatDateDE(weekDates[6])}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setWeekOffset(p => p + 1)} style={{ borderColor: "rgba(201,168,76,0.3)", color: "#C9A84C" }}>
                  <ChevronRight size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)} style={{ borderColor: "rgba(201,168,76,0.3)", color: "#888", fontSize: 11 }}>
                  Heute
                </Button>
              </div>
              {isAdmin && (
                <Button className="dienstplan-primary-action" onClick={() => setShowAddShift(true)} style={{ background: "#C9A84C", color: "#1a0f00", fontWeight: 700 }}>
                  <Plus size={14} style={{ marginRight: 6 }} /> Schicht hinzufügen
                </Button>
              )}
            </div>

            {/* Grid */}
            <div className="dienstplan-table-scroll" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                <thead>
                  <tr>
                    <th style={{ background: "#1E1209", padding: "10px 12px", textAlign: "left", color: "#888", fontSize: 12, fontWeight: 600, borderBottom: "1px solid rgba(201,168,76,0.2)", width: 140 }}>
                      Mitarbeiter
                    </th>
                    {weekDates.map((d, i) => (
                      <th key={i} style={{
                        background: formatDate(d) === formatDate(new Date()) ? "rgba(201,168,76,0.1)" : "#1E1209",
                        padding: "10px 8px", textAlign: "center", color: formatDate(d) === formatDate(new Date()) ? "#C9A84C" : "#888",
                        fontSize: 12, fontWeight: 600, borderBottom: "1px solid rgba(201,168,76,0.2)",
                        borderLeft: "1px solid rgba(201,168,76,0.1)"
                      }}>
                        <div>{WEEKDAYS[i]}</div>
                        <div style={{ fontSize: 11, fontWeight: 400 }}>{d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}</div>
                      </th>
                    ))}
                    <th style={{ background: "#1E1209", padding: "10px 8px", textAlign: "center", color: "#888", fontSize: 12, fontWeight: 600, borderBottom: "1px solid rgba(201,168,76,0.2)", borderLeft: "1px solid rgba(201,168,76,0.1)" }}>
                      Σ Std.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: 40, color: "#666", fontSize: 14 }}>
                        Keine Mitarbeiter vorhanden. Bitte zuerst Mitarbeiter anlegen.
                      </td>
                    </tr>
                  ) : employees.map((emp, rowIdx) => (
                    <tr key={emp.id} style={{ background: rowIdx % 2 === 0 ? "#1a0f00" : "#1E1209" }}>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: emp.color ?? "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#1a0f00", flexShrink: 0 }}>
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#E8DCC8" }}>{emp.name}</div>
                            <div style={{ fontSize: 11, color: "#888" }}>{emp.position}</div>
                          </div>
                        </div>
                      </td>
                      {weekDates.map((d, di) => {
                        const dateStr = formatDate(d);
                        const cellShifts = getShiftsForCell(emp.id, dateStr);
                        return (
                          <td key={di} style={{
                            padding: "4px 4px", borderBottom: "1px solid rgba(201,168,76,0.1)",
                            borderLeft: "1px solid rgba(201,168,76,0.1)",
                            verticalAlign: "top", minWidth: 90,
                            background: formatDate(d) === formatDate(new Date()) ? "rgba(201,168,76,0.05)" : undefined,
                          }}>
                            {cellShifts.map(shift => (
                              <div key={shift.id} style={{
                                background: shift.status === "cancelled" ? "#333" : (emp.color ?? "#C9A84C") + "33",
                                border: `1px solid ${shift.status === "cancelled" ? "#555" : (emp.color ?? "#C9A84C")}66`,
                                borderRadius: 4, padding: "3px 6px", marginBottom: 2, fontSize: 11,
                                opacity: shift.status === "cancelled" ? 0.5 : 1,
                              }}>
                                {editShiftId === shift.id ? (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <input value={editShiftData.startTime} onChange={e => setEditShiftData(p => ({ ...p, startTime: e.target.value }))}
                                      style={{ width: "100%", background: "#1a0f00", border: "1px solid #C9A84C", color: "#fff", borderRadius: 3, padding: "1px 4px", fontSize: 10 }} />
                                    <input value={editShiftData.endTime} onChange={e => setEditShiftData(p => ({ ...p, endTime: e.target.value }))}
                                      style={{ width: "100%", background: "#1a0f00", border: "1px solid #C9A84C", color: "#fff", borderRadius: 3, padding: "1px 4px", fontSize: 10 }} />
                                    <div style={{ display: "flex", gap: 2 }}>
                                      <button onClick={() => updateShiftMut.mutate({ id: shift.id, startTime: editShiftData.startTime, endTime: editShiftData.endTime })}
                                        style={{ background: "#C9A84C", border: "none", borderRadius: 3, padding: "1px 4px", cursor: "pointer", color: "#1a0f00" }}>
                                        <Check size={10} />
                                      </button>
                                      <button onClick={() => setEditShiftId(null)}
                                        style={{ background: "#555", border: "none", borderRadius: 3, padding: "1px 4px", cursor: "pointer", color: "#fff" }}>
                                        <X size={10} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div style={{ color: emp.color ?? "#C9A84C", fontWeight: 700 }}>
                                      {shift.startTime}–{shift.endTime}
                                    </div>
                                    <div style={{ color: "#aaa" }}>{calcHours(shift.startTime, shift.endTime).toFixed(1)}h</div>
                                    {shift.note && <div style={{ color: "#888", fontSize: 10 }}>{shift.note}</div>}
                                    {isAdmin && (
                                      <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                                        <button onClick={() => { setEditShiftId(shift.id); setEditShiftData({ startTime: shift.startTime, endTime: shift.endTime, note: shift.note ?? "" }); }}
                                          style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0 }}>
                                          <Edit2 size={10} />
                                        </button>
                                        <button onClick={() => deleteShiftMut.mutate({ id: shift.id })}
                                          style={{ background: "none", border: "none", cursor: "pointer", color: "#E74C3C", padding: 0 }}>
                                          <Trash2 size={10} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                            {isAdmin && (
                              <button
                                onClick={() => { setNewShift(p => ({ ...p, employeeId: emp.id, shiftDate: dateStr })); setShowAddShift(true); }}
                                style={{ width: "100%", background: "none", border: "1px dashed rgba(201,168,76,0.2)", borderRadius: 4, padding: "2px", cursor: "pointer", color: "#555", fontSize: 16, lineHeight: 1 }}
                              >+</button>
                            )}
                          </td>
                        );
                      })}
                      <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid rgba(201,168,76,0.1)", borderLeft: "1px solid rgba(201,168,76,0.1)", color: "#C9A84C", fontWeight: 700, fontSize: 13 }}>
                        {getWeekHours(emp.id).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MITARBEITER ── */}
        {activeTab === "employees" && isAdmin && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ color: "#C9A84C", margin: 0, fontSize: 20 }}>Mitarbeiter</h2>
              <Button onClick={() => setShowAddEmployee(true)} style={{ background: "#C9A84C", color: "#1a0f00", fontWeight: 700 }}>
                <UserPlus size={14} style={{ marginRight: 6 }} /> Mitarbeiter hinzufügen
              </Button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {allEmployees.map(emp => (
                <div key={emp.id} style={{ background: "#1E1209", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: emp.color ?? "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#1a0f00" }}>
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#E8DCC8" }}>{emp.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>@{emp.username}</div>
                    </div>
                    <Badge style={{ marginLeft: "auto", background: emp.role === "admin" ? "#C9A84C22" : "#33333355", color: emp.role === "admin" ? "#C9A84C" : "#888", border: "none" }}>
                      {emp.role}
                    </Badge>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, color: "#888" }}>
                    <div>Position: <span style={{ color: "#E8DCC8" }}>{emp.position}</span></div>
                    <div>Std/Woche: <span style={{ color: "#C9A84C" }}>{emp.hoursPerWeek}h</span></div>
                    {emp.phone && <div>Tel: <span style={{ color: "#E8DCC8" }}>{emp.phone}</span></div>}
                    {emp.email && <div>E-Mail: <span style={{ color: "#E8DCC8" }}>{emp.email}</span></div>}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <Badge style={{ background: emp.isActive ? "#2ECC7122" : "#E74C3C22", color: emp.isActive ? "#2ECC71" : "#E74C3C", border: "none", fontSize: 11 }}>
                      {emp.isActive ? "Aktiv" : "Inaktiv"}
                    </Badge>
                    <button
                      onClick={() => updateEmployeeMut.mutate({ id: emp.id, isActive: !emp.isActive })}
                      style={{ marginLeft: "auto", background: "none", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 6, padding: "3px 10px", cursor: "pointer", color: "#888", fontSize: 11 }}
                    >
                      {emp.isActive ? "Deaktivieren" : "Aktivieren"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ABWESENHEITEN ── */}
        {activeTab === "absences" && (
          <div>
            <h2 style={{ color: "#C9A84C", marginBottom: 20, fontSize: 20 }}>Abwesenheiten</h2>
            {!isAdmin && (
              <div style={{ background: "#1E1209", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <h3 style={{ color: "#E8DCC8", marginBottom: 12, fontSize: 16 }}>Abwesenheit beantragen</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Von</label>
                    <Input type="date" id="abs-start" style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Bis</label>
                    <Input type="date" id="abs-end" style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Typ</label>
                    <select id="abs-type" style={{ width: "100%", background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff", borderRadius: 6, padding: "8px 10px", fontSize: 14 }}>
                      <option value="vacation">Urlaub</option>
                      <option value="sick">Krank</option>
                      <option value="other">Sonstiges</option>
                    </select>
                  </div>
                  <Button
                    onClick={() => {
                      const start = (document.getElementById("abs-start") as HTMLInputElement).value;
                      const end = (document.getElementById("abs-end") as HTMLInputElement).value;
                      const type = (document.getElementById("abs-type") as HTMLSelectElement).value as any;
                      if (start && end) requestAbsenceMut.mutate({ startDate: start, endDate: end, type });
                    }}
                    style={{ background: "#C9A84C", color: "#1a0f00", fontWeight: 700 }}
                  >
                    Beantragen
                  </Button>
                </div>
              </div>
            )}
            <div style={{ background: "#1E1209", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#2a1a08" }}>
                    {isAdmin && <th style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontSize: 12, fontWeight: 600 }}>Mitarbeiter</th>}
                    <th style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontSize: 12, fontWeight: 600 }}>Typ</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontSize: 12, fontWeight: 600 }}>Von</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontSize: 12, fontWeight: 600 }}>Bis</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontSize: 12, fontWeight: 600 }}>Status</th>
                    {isAdmin && <th style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontSize: 12, fontWeight: 600 }}>Aktion</th>}
                  </tr>
                </thead>
                <tbody>
                  {(isAdmin ? absencesQuery.data ?? [] : myAbsencesQuery.data ?? []).map(abs => {
                    const emp = employees.find(e => e.id === abs.employeeId);
                    const AbsenceIcon = abs.type === "vacation" ? Plane : abs.type === "sick" ? HeartPulse : ClipboardList;
                    const absenceLabel = abs.type === "vacation" ? "Urlaub" : abs.type === "sick" ? "Krank" : "Sonstiges";
                    return (
                      <tr key={abs.id} style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
                        {isAdmin && <td style={{ padding: "10px 16px", color: "#E8DCC8", fontSize: 13 }}>{emp?.name ?? `ID ${abs.employeeId}`}</td>}
                        <td style={{ padding: "10px 16px", color: "#E8DCC8", fontSize: 13 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <AbsenceIcon size={14} color="#C9A84C" />
                            {absenceLabel}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px", color: "#E8DCC8", fontSize: 13 }}>{abs.startDate instanceof Date ? abs.startDate.toISOString().split('T')[0] : String(abs.startDate)}</td>
                        <td style={{ padding: "10px 16px", color: "#E8DCC8", fontSize: 13 }}>{abs.endDate instanceof Date ? abs.endDate.toISOString().split('T')[0] : String(abs.endDate)}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <Badge style={{
                            background: abs.status === "approved" ? "#2ECC7122" : abs.status === "rejected" ? "#E74C3C22" : "#C9A84C22",
                            color: abs.status === "approved" ? "#2ECC71" : abs.status === "rejected" ? "#E74C3C" : "#C9A84C",
                            border: "none", fontSize: 11
                          }}>
                            {abs.status === "approved" ? "Genehmigt" : abs.status === "rejected" ? "Abgelehnt" : "Ausstehend"}
                          </Badge>
                        </td>
                        {isAdmin && (
                          <td style={{ padding: "10px 16px" }}>
                            {abs.status === "pending" && (
                              <div style={{ display: "flex", gap: 6 }}>
                                <button onClick={() => updateAbsenceMut.mutate({ id: abs.id, status: "approved" })}
                                  style={{ background: "#2ECC7122", border: "1px solid #2ECC71", borderRadius: 6, padding: "3px 10px", cursor: "pointer", color: "#2ECC71", fontSize: 11 }}>
                                  ✓ Genehmigen
                                </button>
                                <button onClick={() => updateAbsenceMut.mutate({ id: abs.id, status: "rejected" })}
                                  style={{ background: "#E74C3C22", border: "1px solid #E74C3C", borderRadius: 6, padding: "3px 10px", cursor: "pointer", color: "#E74C3C", fontSize: 11 }}>
                                  ✗ Ablehnen
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SCHICHTVORLAGEN ── */}
        {activeTab === "settings" && isAdmin && (
          <div>
            <h2 style={{ color: "#C9A84C", marginBottom: 20, fontSize: 20 }}>Schichtvorlagen</h2>
            <div style={{ background: "#1E1209", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <h3 style={{ color: "#E8DCC8", marginBottom: 12, fontSize: 16 }}>Neue Vorlage</h3>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
                <div>
                  <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Name</label>
                  <Input id="tmpl-name" placeholder="z.B. Frühschicht" style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Von</label>
                  <Input id="tmpl-start" defaultValue="09:00" style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Bis</label>
                  <Input id="tmpl-end" defaultValue="17:00" style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Farbe</label>
                  <input id="tmpl-color" type="color" defaultValue="#C9A84C" style={{ width: "100%", height: 38, background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 6, cursor: "pointer" }} />
                </div>
                <Button
                  onClick={() => {
                    const name = (document.getElementById("tmpl-name") as HTMLInputElement).value;
                    const start = (document.getElementById("tmpl-start") as HTMLInputElement).value;
                    const end = (document.getElementById("tmpl-end") as HTMLInputElement).value;
                    const color = (document.getElementById("tmpl-color") as HTMLInputElement).value;
                    if (name && start && end) {
                      trpc.dienstplan.createTemplate.useMutation;
                    }
                  }}
                  style={{ background: "#C9A84C", color: "#1a0f00", fontWeight: 700 }}
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {templates.map(tmpl => (
                <div key={tmpl.id} style={{ background: "#1E1209", border: `1px solid ${tmpl.color ?? "#C9A84C"}44`, borderRadius: 10, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: tmpl.color ?? "#C9A84C" }} />
                    <span style={{ fontWeight: 700, color: "#E8DCC8" }}>{tmpl.name}</span>
                  </div>
                  <div style={{ color: "#C9A84C", fontSize: 18, fontWeight: 700 }}>{tmpl.startTime} – {tmpl.endTime}</div>
                  <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{calcHours(tmpl.startTime, tmpl.endTime).toFixed(1)} Stunden</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Dialog: Schicht hinzufügen ── */}
      <Dialog open={showAddShift} onOpenChange={setShowAddShift}>
        <DialogContent style={{ background: "#1E1209", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#C9A84C" }}>Schicht hinzufügen</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Mitarbeiter</label>
              <select
                value={newShift.employeeId}
                onChange={e => setNewShift(p => ({ ...p, employeeId: Number(e.target.value) }))}
                style={{ width: "100%", background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff", borderRadius: 6, padding: "8px 10px", fontSize: 14 }}
              >
                <option value={0}>Mitarbeiter wählen...</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Datum</label>
              <Input type="date" value={newShift.shiftDate} onChange={e => setNewShift(p => ({ ...p, shiftDate: e.target.value }))} style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
            </div>
            {templates.length > 0 && (
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Vorlage (optional)</label>
                <select
                  onChange={e => {
                    const tmpl = templates.find(t => t.id === Number(e.target.value));
                    if (tmpl) setNewShift(p => ({ ...p, startTime: tmpl.startTime, endTime: tmpl.endTime, templateId: tmpl.id }));
                  }}
                  style={{ width: "100%", background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff", borderRadius: 6, padding: "8px 10px", fontSize: 14 }}
                >
                  <option value="">Keine Vorlage</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.startTime}–{t.endTime})</option>)}
                </select>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Von</label>
                <Input value={newShift.startTime} onChange={e => setNewShift(p => ({ ...p, startTime: e.target.value }))} placeholder="09:00" style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
              </div>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Bis</label>
                <Input value={newShift.endTime} onChange={e => setNewShift(p => ({ ...p, endTime: e.target.value }))} placeholder="17:00" style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
              </div>
            </div>
            <div>
              <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Notiz (optional)</label>
              <Input value={newShift.note} onChange={e => setNewShift(p => ({ ...p, note: e.target.value }))} placeholder="z.B. Vertretung" style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddShift(false)} style={{ borderColor: "rgba(201,168,76,0.3)", color: "#888" }}>Abbrechen</Button>
            <Button
              onClick={() => {
                if (!newShift.employeeId || !newShift.shiftDate) return toast.error("Bitte Mitarbeiter und Datum wählen");
                createShiftMut.mutate({ employeeId: newShift.employeeId, shiftDate: newShift.shiftDate, startTime: newShift.startTime, endTime: newShift.endTime, note: newShift.note || undefined, templateId: newShift.templateId || undefined });
              }}
              disabled={createShiftMut.isPending}
              style={{ background: "#C9A84C", color: "#1a0f00", fontWeight: 700 }}
            >
              Schicht erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Mitarbeiter hinzufügen ── */}
      <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
        <DialogContent style={{ background: "#1E1209", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#C9A84C" }}>Mitarbeiter hinzufügen</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Input placeholder="Vollständiger Name *" value={newEmployee.name} onChange={e => setNewEmployee(p => ({ ...p, name: e.target.value }))} style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
            <Input placeholder="Benutzername *" value={newEmployee.username} onChange={e => setNewEmployee(p => ({ ...p, username: e.target.value }))} style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
            <Input type="password" placeholder="Passwort * (mind. 4 Zeichen)" value={newEmployee.password} onChange={e => setNewEmployee(p => ({ ...p, password: e.target.value }))} style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Rolle</label>
                <select value={newEmployee.role} onChange={e => setNewEmployee(p => ({ ...p, role: e.target.value as any }))}
                  style={{ width: "100%", background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff", borderRadius: 6, padding: "8px 10px", fontSize: 14 }}>
                  <option value="staff">Mitarbeiter</option>
                  <option value="manager">Schichtleiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Std/Woche</label>
                <Input type="number" value={newEmployee.hoursPerWeek} onChange={e => setNewEmployee(p => ({ ...p, hoursPerWeek: Number(e.target.value) }))} style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
              </div>
            </div>
            <Input placeholder="Position (z.B. Koch)" value={newEmployee.position} onChange={e => setNewEmployee(p => ({ ...p, position: e.target.value }))} style={{ background: "#2a1a08", border: "1px solid rgba(201,168,76,0.3)", color: "#fff" }} />
            <div>
              <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 4 }}>Farbe im Dienstplan</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setNewEmployee(p => ({ ...p, color: c }))}
                    style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: newEmployee.color === c ? "3px solid #fff" : "2px solid transparent", cursor: "pointer" }} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEmployee(false)} style={{ borderColor: "rgba(201,168,76,0.3)", color: "#888" }}>Abbrechen</Button>
            <Button
              onClick={() => createEmployeeMut.mutate(newEmployee)}
              disabled={createEmployeeMut.isPending}
              style={{ background: "#C9A84C", color: "#1a0f00", fontWeight: 700 }}
            >
              Anlegen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
