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

module.exports = db;