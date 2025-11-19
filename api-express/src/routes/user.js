import express from 'express'
import db from '../db/database.js'
import { sanitizeString, validateUsername } from '../utils/validator.js'

const router = express.Router()

// Get user by username
router.get('/:username', (req, res) => {
  const { username } = req.params

  // Sanitize and validate username
  const sanitizedUsername = sanitizeString(username, 30)
  if (!validateUsername(sanitizedUsername)) {
    return res.status(400).json({ error: 'Format username tidak valid!' })
  }

  try {
    const stmt = db.prepare('SELECT id, username, full_name FROM users WHERE username = ?')
    const user = stmt.get(sanitizedUsername)

    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ error: 'User tidak ditemukan!' })
    }
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Database error' })
  }
})

export default router

