// initializeDB.js
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./mydatabase.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Database connected");
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_count INTEGER NOT NULL,
          item_name TEXT NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS availability (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_name TEXT NOT NULL,
          available INTEGER NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_name TEXT NOT NULL
        )
      `);
    });
  }
});

module.exports = db;
