import express from 'express'
import bcrypt from 'bcrypt'
import db from '../db/database.js'
import { requireAuth } from '../middleware/auth.js'
import { sanitizeString, validateUsername, validateFullName, validatePassword } from '../utils/validator.js'

const router = express.Router()

// Check authentication status
router.get('/check', (req, res) => {
  if (req.session && req.session.user_id) {
    res.json({
      id: req.session.user_id,
      username: req.session.username,
      full_name: req.session.full_name
    })
  } else {
    res.status(401).json({ error: 'Not authenticated' })
  }
})

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi!' })
  }

  // Sanitize and validate input
  const sanitizedUsername = sanitizeString(username, 30)
  if (!validateUsername(sanitizedUsername)) {
    return res.status(400).json({ error: 'Format username tidak valid!' })
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Format password tidak valid!' })
  }

  try {
    const stmt = db.prepare('SELECT id, username, password, full_name FROM users WHERE username = ?')
    const user = stmt.get(sanitizedUsername)

    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah!' })
    }

    // Verify password with salt 'bismillah221'
    const isValid = bcrypt.compareSync(password + 'bismillah221', user.password)

    if (!isValid) {
      return res.status(401).json({ error: 'Username atau password salah!' })
    }

    // Set session
    req.session.user_id = user.id
    req.session.username = user.username
    req.session.full_name = user.full_name

    res.json({
      id: user.id,
      username: user.username,
      full_name: user.full_name
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Terjadi kesalahan saat login' })
  }
})

// Register
router.post('/register', (req, res) => {
  const { username, full_name, password } = req.body

  if (!username || !full_name || !password) {
    return res.status(400).json({ error: 'Semua field harus diisi!' })
  }

  // Sanitize and validate inputs
  const sanitizedUsername = sanitizeString(username, 30)
  const sanitizedFullName = sanitizeString(full_name, 100)

  if (!validateUsername(sanitizedUsername)) {
    return res.status(400).json({ error: 'Format username tidak valid! (3-30 karakter, alphanumeric dan underscore saja)' })
  }

  if (!validateFullName(sanitizedFullName)) {
    return res.status(400).json({ error: 'Format nama tidak valid!' })
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password minimal 6 karakter dan maksimal 100 karakter!' })
  }

  try {
    // Check if username exists
    const checkStmt = db.prepare('SELECT id FROM users WHERE username = ?')
    const existing = checkStmt.get(sanitizedUsername)

    if (existing) {
      return res.status(400).json({ error: 'Username sudah digunakan!' })
    }

    // Hash password with salt 'bismillah221'
    const hashedPassword = bcrypt.hashSync(password + 'bismillah221', 10)

    // Insert new user
    const insertStmt = db.prepare('INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)')
    const result = insertStmt.run(sanitizedUsername, hashedPassword, sanitizedFullName)

    // Auto login
    req.session.user_id = result.lastInsertRowid
    req.session.username = sanitizedUsername
    req.session.full_name = sanitizedFullName

    res.json({
      id: result.lastInsertRowid,
      username: sanitizedUsername,
      full_name: sanitizedFullName
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Terjadi kesalahan saat registrasi' })
  }
})

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' })
    }
    res.json({ message: 'Logged out successfully' })
  })
})

export default router

