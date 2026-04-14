const isProduction = process.env.NODE_ENV === "production";

let pool;

if (isProduction) {
  const { Pool } = require("pg");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT
    )
  `);
} else {
  const Database = require("better-sqlite3");
  const db = new Database("expenses.db");

  db.prepare(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT
    )
  `).run();

  pool = {
    query: (text, params) => {
      const stmt = db.prepare(text
        .replace(/\$1/g, "?")
        .replace(/\$2/g, "?")
        .replace(/\$3/g, "?")
        .replace(/\$4/g, "?")
        .replace(/\$5/g, "?")
      );
      const isSelect = text.trim().toUpperCase().startsWith("SELECT");
      if (isSelect) {
        return Promise.resolve({ rows: stmt.all(params || []) });
      } else {
        stmt.run(params || []);
        return Promise.resolve({ rows: [] });
      }
    }
  };
}

module.exports = pool;