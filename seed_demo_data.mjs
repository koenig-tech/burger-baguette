import { createConnection } from "mysql2/promise";
import { config } from "dotenv";

config();

const connection = await createConnection(process.env.DATABASE_URL);

// Demo-Mitarbeiter einfügen (role: admin|manager|staff)
const employees = [
  ["Emre Yilmaz", "emre_yilmaz", "admin", "Chefkoch / Inhaber", "admin", "14.50", "#C9A84C", "vollzeit", 40],
  ["Lisa Müller", "lisa_mueller", "lisa123", "Service", "staff", "13.00", "#4CAF50", "teilzeit", 25],
  ["Kemal Demir", "kemal_demir", "kemal123", "Grillmeister", "staff", "13.50", "#2196F3", "vollzeit", 40],
  ["Sara Hoffmann", "sara_hoffmann", "sara123", "Kassierer", "staff", "12.50", "#E91E63", "minijob", 15],
  ["Max Bauer", "max_bauer", "max123", "Aushilfe", "staff", "12.00", "#FF9800", "aushilfe", 10],
];

console.log("Füge Mitarbeiter ein...");
const insertedIds = {};
for (const [name, username, passwordHash, position, role, hourlyWage, color, contractType, hoursPerWeek] of employees) {
  try {
    const [result] = await connection.execute(
      `INSERT INTO employees (name, username, password_hash, position, role, hourly_wage, color, contract_type, hours_per_week, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [name, username, passwordHash, position, role, hourlyWage, color, contractType, hoursPerWeek]
    );
    insertedIds[username] = result.insertId;
    console.log(`  ✅ ${name} (ID: ${result.insertId})`);
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      const [rows] = await connection.execute("SELECT id FROM employees WHERE username = ?", [username]);
      insertedIds[username] = rows[0]?.id;
      console.log(`  ⚠️  ${name} existiert bereits (ID: ${insertedIds[username]})`);
    } else {
      console.error(`  ❌ ${name}: ${e.message}`);
    }
  }
}

console.log("\nMitarbeiter-IDs:", insertedIds);

// Emre-ID als Uploader (Admin)
const adminId = insertedIds["emre_yilmaz"] || 1;

// Demo-Dokumente einfügen
const docs = [
  // Emre
  [insertedIds["emre_yilmaz"], "Arbeitsvertrag 2024", "vertrag", "Unbefristeter Vertrag, 40h/Woche", adminId, 1, 1],
  [insertedIds["emre_yilmaz"], "Personalausweis", "ausweis", "Gültig bis 2030", adminId, 1, 0],
  [insertedIds["emre_yilmaz"], "Lebensmittelhygiene-Zertifikat", "zeugnis", "IHK Zertifikat 2023", adminId, 1, 1],
  // Lisa
  [insertedIds["lisa_mueller"], "Arbeitsvertrag 2025", "vertrag", "Teilzeit 25h/Woche", adminId, 1, 1],
  [insertedIds["lisa_mueller"], "Personalausweis", "ausweis", "Gültig bis 2028", adminId, 1, 0],
  [insertedIds["lisa_mueller"], "Krankmeldung 03.2026", "krankmeldung", "3 Tage krank, AU liegt vor", adminId, 0, 0],
  // Kemal
  [insertedIds["kemal_demir"], "Arbeitsvertrag 2025", "vertrag", "Vollzeit 40h/Woche", adminId, 1, 1],
  [insertedIds["kemal_demir"], "Reisepass", "ausweis", "Türkischer Pass, gültig bis 2027", adminId, 1, 0],
  [insertedIds["kemal_demir"], "Grillmeister-Zertifikat", "zeugnis", "Berufsausbildung Koch, IHK 2020", adminId, 1, 1],
  [insertedIds["kemal_demir"], "Lohnabrechnung April 2026", "lohnabrechnung", "Netto 1.620 €", adminId, 1, 0],
  // Sara
  [insertedIds["sara_hoffmann"], "Arbeitsvertrag 2026", "vertrag", "Minijob 520 €/Monat", adminId, 1, 1],
  [insertedIds["sara_hoffmann"], "Personalausweis", "ausweis", "Gültig bis 2031", adminId, 0, 0],
  // Max
  [insertedIds["max_bauer"], "Aushilfsvertrag 2026", "vertrag", "Auf Abruf, max. 15h/Woche", adminId, 1, 0],
  [insertedIds["max_bauer"], "Personalausweis", "ausweis", "Noch nicht eingereicht", adminId, 0, 0],
];

console.log("\nFüge Dokumente ein...");
for (const [employeeId, title, category, notes, uploadedBy, signedByAdmin, signedByEmployee] of docs) {
  if (!employeeId) { console.log(`  ⚠️  Kein Mitarbeiter für: ${title}`); continue; }
  try {
    await connection.execute(
      `INSERT INTO personal_documents (employee_id, title, category, notes, uploaded_by, signed_by_admin, signed_by_employee, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [employeeId, title, category, notes, uploadedBy, signedByAdmin, signedByEmployee]
    );
    console.log(`  ✅ ${title}`);
  } catch (e) {
    console.error(`  ❌ ${title}: ${e.message}`);
  }
}

console.log("\n✅ Demo-Daten erfolgreich eingefügt!");
console.log("Mitarbeiter:", employees.map(e => e[0]).join(", "));
await connection.end();
