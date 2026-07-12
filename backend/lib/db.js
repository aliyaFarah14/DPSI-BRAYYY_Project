const Database = require("better-sqlite3")
const path = require("path")

const DB_PATH = path.join(__dirname, "..", "data", "perpustakaan.db")

const db = new Database(DB_PATH)
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

module.exports = {
  run(sql, params = []) {
    return db.prepare(sql).run(...params)
  },
  get(sql, params = []) {
    return db.prepare(sql).get(...params) ?? null
  },
  all(sql, params = []) {
    return db.prepare(sql).all(...params)
  },
  transaction(fn) {
    return db.transaction(fn)
  },
  close() {
    db.close()
  }
}
