import { createConnection } from "mysql2/promise";
import { createHash } from "crypto";
import { config } from "dotenv";

config();

const SALT = "bb-dienstplan-2026";

function hashPassword(password) {
  return createHash("sha256").update(SALT + password).digest("hex");
}

const conn = await createConnection(process.env.DATABASE_URL);

// Alle Accounts mit korrekten gehashten Passwörtern aktualisieren
const updates = [
  { id: 1,     username: "admin",       password: "admin" },
  { id: 60001, username: "emre",        password: "admin" },
  { id: 60002, username: "emre_yilmaz", password: "admin" },
  { id: 60003, username: "lisa_mueller",password: "lisa123" },
  { id: 60004, username: "kemal_demir", password: "kemal123" },
  { id: 60005, username: "sara_hoffmann",password: "sara123" },
  { id: 60006, username: "max_bauer",   password: "max123" },
];

console.log("Setze korrekte Passwort-Hashes...\n");
for (const { id, username, password } of updates) {
  const hash = hashPassword(password);
  await conn.execute("UPDATE employees SET password_hash = ? WHERE id = ?", [hash, id]);
  console.log(`  ✅ ${username} → Passwort: "${password}" → Hash: ${hash.substring(0, 20)}...`);
}

console.log("\n✅ Alle Passwörter korrekt gesetzt!");
console.log("\n📋 Login-Zugangsdaten:");
console.log("  Benutzername: admin   | Passwort: admin   (Admin)");
console.log("  Benutzername: emre    | Passwort: admin   (Admin)");
console.log("  Benutzername: lisa_mueller  | Passwort: lisa123");
console.log("  Benutzername: kemal_demir   | Passwort: kemal123");

await conn.end();
