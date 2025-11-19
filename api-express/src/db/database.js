import initSqlJs from 'sql.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Database path (same as PHP config)
const dbPath = path.join(__dirname, '../../db_doa/umrah.sqlite')
const dbDir = path.dirname(dbPath)

// Create directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Initialize SQL.js
let SQL
let db

// Initialize database
export const initDatabase = async () => {
  try {
    // Load WASM file directly from node_modules
    const wasmPath = path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')
    
    if (!fs.existsSync(wasmPath)) {
      throw new Error(`WASM file not found at: ${wasmPath}`)
    }
    
    const wasmBinary = fs.readFileSync(wasmPath)
    
    SQL = await initSqlJs({
      wasmBinary: wasmBinary
    })

    // Load existing database or create new one
    let data
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath)
      data = new Uint8Array(buffer)
      db = new SQL.Database(data)
    } else {
      db = new SQL.Database()
    }

    // Create tables if not exists
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS prayers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        sender_name TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Save database to file
    saveDatabase()

    console.log('Database initialized at:', dbPath)
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// Save database to file
const saveDatabase = () => {
  try {
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(dbPath, buffer)
  } catch (error) {
    console.error('Error saving database:', error)
  }
}

// Wrapper untuk kompatibilitas dengan better-sqlite3 API
const createDbWrapper = () => {
  return {
    prepare: (sql) => {
      if (!db) {
        throw new Error('Database not initialized. Call initDatabase() first.')
      }
      const stmt = db.prepare(sql)
      return {
        get: (...params) => {
          if (params.length > 0) {
            stmt.bind(params)
          }
          const result = stmt.step() ? stmt.getAsObject() : null
          stmt.reset()
          if (result && Object.keys(result).length > 0) {
            return result
          }
          return undefined
        },
        run: (...params) => {
          if (params.length > 0) {
            stmt.bind(params)
          }
          stmt.step()
          const changes = db.getRowsModified()
          // Get last insert rowid
          const lastInsertResult = db.exec("SELECT last_insert_rowid()")
          const lastInsertRowid = lastInsertResult.length > 0 && lastInsertResult[0].values.length > 0
            ? lastInsertResult[0].values[0][0]
            : null
          stmt.reset()
          saveDatabase() // Auto-save after modification
          return {
            changes: changes,
            lastInsertRowid: lastInsertRowid
          }
        },
        all: (...params) => {
          if (params.length > 0) {
            stmt.bind(params)
          }
          const results = []
          while (stmt.step()) {
            results.push(stmt.getAsObject())
          }
          stmt.reset()
          return results
        }
      }
    },
    exec: (sql) => {
      if (!db) {
        throw new Error('Database not initialized. Call initDatabase() first.')
      }
      db.run(sql)
      saveDatabase() // Auto-save after modification
    },
    // Helper untuk COUNT queries
    getRowsModified: () => {
      if (!db) {
        throw new Error('Database not initialized. Call initDatabase() first.')
      }
      return db.getRowsModified()
    }
  }
}

// Create wrapper instance
const dbWrapper = createDbWrapper()

// Export dbWrapper
export default dbWrapper
