import 'dotenv/config';
import mysql from 'mysql2/promise';

const hash = '872b15d687cb5bafa2ae4d980c6bd4ee8d6245b2d260ef3ba4184bf0871d6fa7'; // sha256("bb-dienstplan-2026" + "admin")

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Update existing admin user
const [result] = await conn.execute(
  'UPDATE employees SET password_hash = ?, username = ?, is_active = 1 WHERE id = 1 OR username = ? OR name = ?',
  [hash, 'admin', 'admin', 'Emre']
);
console.log('Updated rows:', result.affectedRows);

// Show current employees
const [rows] = await conn.execute('SELECT id, name, username, role, is_active FROM employees');
console.log('Current employees:', rows);

await conn.end();
