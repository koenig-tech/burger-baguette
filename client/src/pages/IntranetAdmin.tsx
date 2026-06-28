import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ClipboardList, Users } from "lucide-react";

type IntranetUser = {
  id: number;
  name: string;
  username: string;
  role: "admin" | "manager" | "staff";
  canEditKalkulation: boolean;
  canEditRezepte: boolean;
  canEditFinanzen: boolean;
  canEditDashboard: boolean;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Chef / Admin",
  manager: "Schichtleiter",
  staff: "Mitarbeiter",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "#C9A84C",
  manager: "#60a5fa",
  staff: "#4ade80",
};

const s = {
  page: {
    minHeight: "100vh",
    background: "#1a1a1a",
    fontFamily: "'Inter', sans-serif",
    color: "#EDE8DC",
  } as React.CSSProperties,
  header: {
    background: "#242424",
    borderBottom: "1px solid #333",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 24px",
  } as React.CSSProperties,
  card: {
    background: "#242424",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
  } as React.CSSProperties,
  btn: (color = "#C9A84C", text = "#1a1a1a") => ({
    padding: "8px 16px",
    background: color,
    color: text,
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  } as React.CSSProperties),
  input: {
    padding: "8px 12px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "6px",
    color: "#EDE8DC",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  label: {
    display: "block",
    color: "#aaa",
    fontSize: "12px",
    marginBottom: "4px",
    fontWeight: "500",
  } as React.CSSProperties,
  badge: (role: string) => ({
    padding: "2px 10px",
    background: `${ROLE_COLORS[role] || "#888"}22`,
    color: ROLE_COLORS[role] || "#888",
    border: `1px solid ${ROLE_COLORS[role] || "#888"}44`,
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  } as React.CSSProperties),
};

function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    username: "", password: "", name: "",
    role: "staff" as "admin" | "manager" | "staff",
    canEditKalkulation: false, canEditRezepte: false,
    canEditFinanzen: false, canEditDashboard: false,
  });
  const [error, setError] = useState("");

  const createMutation = trpc.intranet.createUser.useMutation({
    onSuccess: () => { onSuccess(); setForm({ username: "", password: "", name: "", role: "staff", canEditKalkulation: false, canEditRezepte: false, canEditFinanzen: false, canEditDashboard: false }); },
    onError: (e) => setError(e.message),
  });

  return (
    <div style={{ background: "#1a1a1a", borderRadius: "8px", padding: "20px", marginTop: "16px" }}>
      <h4 style={{ margin: "0 0 16px", color: "#C9A84C", fontSize: "15px" }}>Neuen Mitarbeiter anlegen</h4>
      {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        <div>
          <label style={s.label}>Vollständiger Name</label>
          <input style={s.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Max Mustermann" />
        </div>
        <div>
          <label style={s.label}>Benutzername</label>
          <input style={s.input} value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} placeholder="max.mustermann" />
        </div>
        <div>
          <label style={s.label}>Passwort</label>
          <input style={s.input} type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 Zeichen" />
        </div>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={s.label}>Rolle</label>
        <select style={{ ...s.input, width: "auto" }} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as any }))}>
          <option value="staff">Mitarbeiter</option>
          <option value="manager">Schichtleiter</option>
          <option value="admin">Chef / Admin</option>
        </select>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={s.label}>Bearbeitungsrechte</label>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {([
            ["canEditKalkulation", "Kostenkalkulation"],
            ["canEditRezepte", "Rezepte"],
            ["canEditFinanzen", "Finanzen"],
            ["canEditDashboard", "Dashboard"],
          ] as [keyof typeof form, string][]).map(([key, label]) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", color: "#ccc" }}>
              <input type="checkbox" checked={form[key] as boolean} onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))} />
              {label}
            </label>
          ))}
        </div>
      </div>
      <button style={s.btn()} onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending}>
        {createMutation.isPending ? "Wird angelegt..." : "Mitarbeiter anlegen"}
      </button>
    </div>
  );
}

function UserRow({ user, onRefresh }: { user: IntranetUser; onRefresh: () => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    role: user.role,
    password: "",
    canEditKalkulation: user.canEditKalkulation,
    canEditRezepte: user.canEditRezepte,
    canEditFinanzen: user.canEditFinanzen,
    canEditDashboard: user.canEditDashboard,
  });

  const updateMutation = trpc.intranet.updateUser.useMutation({
    onSuccess: () => { setEditing(false); onRefresh(); },
  });
  const deactivateMutation = trpc.intranet.deactivateUser.useMutation({
    onSuccess: onRefresh,
  });

  return (
    <div style={{ borderBottom: "1px solid #333", padding: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: `${ROLE_COLORS[user.role]}22`,
            border: `1px solid ${ROLE_COLORS[user.role]}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: "700", color: ROLE_COLORS[user.role],
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: "600", fontSize: "14px" }}>{user.name}</div>
            <div style={{ color: "#888", fontSize: "12px" }}>@{user.username}</div>
          </div>
          <span style={s.badge(user.role)}>{ROLE_LABELS[user.role]}</span>
          {!user.isActive && <span style={{ ...s.badge(""), background: "#33333388", color: "#888", border: "1px solid #444" }}>Deaktiviert</span>}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ fontSize: "11px", color: "#666", textAlign: "right" }}>
            {user.lastLogin ? (
              <span>Login: {new Date(user.lastLogin).toLocaleDateString("de-DE")}</span>
            ) : <span>Noch kein Login</span>}
          </div>
          <button style={s.btn("#333", "#ccc")} onClick={() => setEditing(!editing)}>
            {editing ? "Abbrechen" : "Bearbeiten"}
          </button>
          {user.isActive && (
            <button style={s.btn("#7f1d1d", "#fca5a5")} onClick={() => deactivateMutation.mutate({ id: user.id })} disabled={deactivateMutation.isPending}>
              Deaktivieren
            </button>
          )}
        </div>
      </div>

      {/* Bearbeitungsrechte-Anzeige */}
      <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap", paddingLeft: "48px" }}>
        {[
          [user.canEditKalkulation, "Kalkulation"],
          [user.canEditRezepte, "Rezepte"],
          [user.canEditFinanzen, "Finanzen"],
          [user.canEditDashboard, "Dashboard"],
        ].map(([can, label]) => (
          <span key={label as string} style={{
            fontSize: "11px", padding: "2px 8px", borderRadius: "4px",
            background: can ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
            color: can ? "#4ade80" : "#555",
            border: `1px solid ${can ? "rgba(74,222,128,0.2)" : "#333"}`,
          }}>
            {can ? "✓" : "✗"} {label}
          </span>
        ))}
      </div>

      {/* Inline-Bearbeitungsformular */}
      {editing && (
        <div style={{ background: "#1a1a1a", borderRadius: "8px", padding: "16px", marginTop: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={s.label}>Name</label>
              <input style={s.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label style={s.label}>Neues Passwort (optional)</label>
              <input style={s.input} type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Leer = unverändert" />
            </div>
            <div>
              <label style={s.label}>Rolle</label>
              <select style={{ ...s.input, width: "auto" }} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as any }))}>
                <option value="staff">Mitarbeiter</option>
                <option value="manager">Schichtleiter</option>
                <option value="admin">Chef / Admin</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={s.label}>Bearbeitungsrechte</label>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {([
                ["canEditKalkulation", "Kostenkalkulation"],
                ["canEditRezepte", "Rezepte"],
                ["canEditFinanzen", "Finanzen"],
                ["canEditDashboard", "Dashboard"],
              ] as [keyof typeof form, string][]).map(([key, label]) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", color: "#ccc" }}>
                  <input type="checkbox" checked={form[key] as boolean} onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))} />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <button style={s.btn()} onClick={() => updateMutation.mutate({ id: user.id, ...form, password: form.password || undefined })} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Speichern..." : "Änderungen speichern"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function IntranetAdmin() {
  const [activeTab, setActiveTab] = useState<"users" | "log">("users");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [, setLocation] = useLocation();

  const meQuery = trpc.intranet.me.useQuery();
  const usersQuery = trpc.intranet.listUsers.useQuery(undefined, {
    enabled: meQuery.data?.role === "admin",
  });
  const auditQuery = trpc.intranet.getAuditLog.useQuery({ limit: 200 }, {
    enabled: !!meQuery.data,
  });
  const logoutMutation = trpc.intranet.logout.useMutation({
    onSuccess: () => setLocation("/intranet/login"),
  });

  const utils = trpc.useUtils();

  if (meQuery.isLoading) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#C9A84C" }}>Lade...</div>
      </div>
    );
  }

  if (!meQuery.data) {
    setLocation("/intranet/login");
    return null;
  }

  const me = meQuery.data;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "36px", height: "36px", background: "#C9A84C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "#1a1a1a", fontSize: "14px" }}>BB</div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "16px" }}>Burger & Baguette Intranet</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Admin-Panel · Benutzerverwaltung</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "14px", fontWeight: "600" }}>{me.name}</div>
            <span style={s.badge(me.role)}>{ROLE_LABELS[me.role]}</span>
          </div>
          <button style={s.btn("#333", "#ccc")} onClick={() => setLocation("/intranet")}>← Intranet</button>
          <button style={s.btn("#7f1d1d", "#fca5a5")} onClick={() => logoutMutation.mutate()}>Abmelden</button>
        </div>
      </div>

      <div style={s.container}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {me.role === "admin" && (
            <button
              style={{ ...s.btn(activeTab === "users" ? "#C9A84C" : "#333", activeTab === "users" ? "#1a1a1a" : "#ccc"), fontSize: "14px", padding: "10px 20px" }}
              onClick={() => setActiveTab("users")}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Users size={15} />
                Mitarbeiter
              </span>
            </button>
          )}
          <button
            style={{ ...s.btn(activeTab === "log" ? "#C9A84C" : "#333", activeTab === "log" ? "#1a1a1a" : "#ccc"), fontSize: "14px", padding: "10px 20px" }}
            onClick={() => setActiveTab("log")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ClipboardList size={15} />
              Änderungs-Log
            </span>
          </button>
        </div>

        {/* Mitarbeiter-Tab */}
        {activeTab === "users" && me.role === "admin" && (
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "18px" }}>Mitarbeiter-Verwaltung</h2>
              <button style={s.btn()} onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? "Abbrechen" : "+ Neuer Mitarbeiter"}
              </button>
            </div>

            {showCreateForm && (
              <CreateUserForm onSuccess={() => {
                setShowCreateForm(false);
                utils.intranet.listUsers.invalidate();
              }} />
            )}

            <div style={{ marginTop: "8px" }}>
              {usersQuery.isLoading ? (
                <div style={{ color: "#888", padding: "20px 0" }}>Lade Mitarbeiter...</div>
              ) : usersQuery.data?.length === 0 ? (
                <div style={{ color: "#888", padding: "20px 0" }}>Noch keine Mitarbeiter angelegt.</div>
              ) : (
                usersQuery.data?.map(user => (
                  <UserRow key={user.id} user={user as IntranetUser} onRefresh={() => utils.intranet.listUsers.invalidate()} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Audit-Log-Tab */}
        {activeTab === "log" && (
          <div style={s.card}>
            <h2 style={{ margin: "0 0 16px", fontSize: "18px" }}>
              Änderungs-Dokumentation
              {me.role !== "admin" && <span style={{ fontSize: "13px", color: "#888", fontWeight: "400", marginLeft: "8px" }}>(nur eigene Änderungen)</span>}
            </h2>

            {auditQuery.isLoading ? (
              <div style={{ color: "#888" }}>Lade Protokoll...</div>
            ) : auditQuery.data?.length === 0 ? (
              <div style={{ color: "#888", padding: "20px 0" }}>Noch keine Änderungen protokolliert.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #444" }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", color: "#888", fontWeight: "600" }}>Datum & Zeit</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", color: "#888", fontWeight: "600" }}>Mitarbeiter</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", color: "#888", fontWeight: "600" }}>Aktion</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", color: "#888", fontWeight: "600" }}>Bereich</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", color: "#888", fontWeight: "600" }}>Feld</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", color: "#888", fontWeight: "600" }}>Alt → Neu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditQuery.data?.map((entry) => (
                      <tr key={entry.id} style={{ borderBottom: "1px solid #2a2a2a" }}>
                        <td style={{ padding: "8px 12px", color: "#888", whiteSpace: "nowrap" }}>
                          {new Date(entry.createdAt).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td style={{ padding: "8px 12px" }}>
                          <div style={{ fontWeight: "600" }}>{entry.userName}</div>
                          <span style={s.badge(entry.userRole)}>{ROLE_LABELS[entry.userRole] || entry.userRole}</span>
                        </td>
                        <td style={{ padding: "8px 12px" }}>
                          <span style={{
                            padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600",
                            background: entry.action === "create" ? "rgba(74,222,128,0.1)" : entry.action === "delete" || entry.action === "deactivate" ? "rgba(239,68,68,0.1)" : "rgba(201,168,76,0.1)",
                            color: entry.action === "create" ? "#4ade80" : entry.action === "delete" || entry.action === "deactivate" ? "#f87171" : "#C9A84C",
                          }}>
                            {entry.action === "create" ? "Erstellt" : entry.action === "update" ? "Bearbeitet" : entry.action === "delete" ? "Gelöscht" : entry.action === "deactivate" ? "Deaktiviert" : entry.action}
                          </span>
                        </td>
                        <td style={{ padding: "8px 12px", color: "#ccc" }}>{entry.section}</td>
                        <td style={{ padding: "8px 12px", color: "#aaa", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {entry.field || "–"}
                        </td>
                        <td style={{ padding: "8px 12px", maxWidth: "250px" }}>
                          {entry.oldValue && (
                            <span style={{ color: "#f87171", textDecoration: "line-through", marginRight: "6px", fontSize: "12px" }}>{entry.oldValue}</span>
                          )}
                          {entry.newValue && (
                            <span style={{ color: "#4ade80", fontSize: "12px" }}>{entry.newValue}</span>
                          )}
                          {!entry.oldValue && !entry.newValue && <span style={{ color: "#555" }}>–</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
