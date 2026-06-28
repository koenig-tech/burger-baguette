import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function IntranetLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const loginMutation = trpc.intranet.login.useMutation({
    onSuccess: () => {
      setLocation("/intranet");
    },
    onError: (err) => {
      setError(err.message || "Anmeldung fehlgeschlagen");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ username, password });
  };

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
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "48px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            background: "#C9A84C",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "24px",
            fontWeight: "900",
            color: "#1a1a1a",
          }}>BB</div>
          <h1 style={{ color: "#EDE8DC", fontSize: "22px", fontWeight: "700", margin: "0 0 4px" }}>
            Burger & Baguette
          </h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Intranet · Mitarbeiter-Login</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#aaa", fontSize: "13px", marginBottom: "6px", fontWeight: "500" }}>
              Benutzername
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="z.B. max.mustermann"
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "8px",
                color: "#EDE8DC",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: "#aaa", fontSize: "13px", marginBottom: "6px", fontWeight: "500" }}>
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "8px",
                color: "#EDE8DC",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "#f87171",
              fontSize: "14px",
              marginBottom: "16px",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            style={{
              width: "100%",
              padding: "12px",
              background: loginMutation.isPending ? "#a07a2e" : "#C9A84C",
              color: "#1a1a1a",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loginMutation.isPending ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loginMutation.isPending ? "Anmelden..." : "Anmelden"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#555", fontSize: "12px", marginTop: "24px" }}>
          Nur für autorisierte Mitarbeiter
        </p>
      </div>
    </div>
  );
}
