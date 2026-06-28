import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function IntranetSetup() {
  const [form, setForm] = useState({ username: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const setupMutation = trpc.intranet.setupAdmin.useMutation({
    onSuccess: () => setLocation("/intranet/login"),
    onError: (e) => setError(e.message),
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1a1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        background: "#242424",
        border: "1px solid #C9A84C44",
        borderRadius: "12px",
        padding: "48px",
        width: "100%",
        maxWidth: "440px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔧</div>
          <h1 style={{ color: "#C9A84C", fontSize: "22px", fontWeight: "700", margin: "0 0 8px" }}>
            Intranet Ersteinrichtung
          </h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
            Lege den ersten Admin-Account an. Dieser Schritt ist nur einmalig möglich.
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", color: "#aaa", fontSize: "13px", marginBottom: "6px" }}>Vollständiger Name</label>
          <input
            style={{ width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #444", borderRadius: "8px", color: "#EDE8DC", fontSize: "15px", boxSizing: "border-box" }}
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="z.B. Thomas Müller"
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", color: "#aaa", fontSize: "13px", marginBottom: "6px" }}>Benutzername</label>
          <input
            style={{ width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #444", borderRadius: "8px", color: "#EDE8DC", fontSize: "15px", boxSizing: "border-box" }}
            value={form.username}
            onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
            placeholder="z.B. admin"
          />
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", color: "#aaa", fontSize: "13px", marginBottom: "6px" }}>Passwort</label>
          <input
            style={{ width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #444", borderRadius: "8px", color: "#EDE8DC", fontSize: "15px", boxSizing: "border-box" }}
            type="password"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            placeholder="Min. 6 Zeichen"
          />
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#f87171", fontSize: "14px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <button
          onClick={() => setupMutation.mutate(form)}
          disabled={setupMutation.isPending}
          style={{ width: "100%", padding: "12px", background: "#C9A84C", color: "#1a1a1a", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
        >
          {setupMutation.isPending ? "Wird eingerichtet..." : "Admin-Account anlegen"}
        </button>
      </div>
    </div>
  );
}
