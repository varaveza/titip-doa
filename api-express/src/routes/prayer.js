import express from 'express'
import db from '../db/database.js'
import { requireAuth } from '../middleware/auth.js'
import { sanitizeString, sanitizeMessage } from '../utils/validator.js'

const router = express.Router()

// Get prayers for logged in user
router.get('/', requireAuth, (req, res) => {
  const { tab } = req.query
  const userId = req.session.user_id
  const isRead = tab === 'read' ? 1 : 0

  try {
    // Get prayers
    const stmt = db.prepare(`
      SELECT * FROM prayers 
      WHERE user_id = ? AND is_read = ? 
      ORDER BY created_at DESC
    `)
    const prayers = stmt.all(userId, isRead)

    // Get unread count
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM prayers WHERE user_id = ? AND is_read = 0')
    const unreadCount = countStmt.get(userId).count

    res.json({
      prayers: prayers,
      unread_count: unreadCount
    })
  } catch (error) {
    console.error('Get prayers error:', error)
    res.status(500).json({ error: 'Database error' })
  }
})

// Submit prayer (public endpoint)
router.post('/submit', (req, res) => {
  const { user_id, sender_name, message } = req.body

  if (!user_id || !sender_name || !message) {
    return res.status(400).json({ error: 'Nama pengirim dan isi doa harus diisi!' })
  }

  // Validate user_id is integer
  const userId = parseInt(user_id, 10)
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' })
  }

  // Sanitize inputs
  const sanitizedSenderName = sanitizeString(sender_name, 100)
  const sanitizedMessage = sanitizeMessage(message, 2000)

  if (!sanitizedSenderName.trim() || !sanitizedMessage.trim()) {
    return res.status(400).json({ error: 'Nama pengirim dan isi doa harus diisi!' })
  }

  try {
    const stmt = db.prepare('INSERT INTO prayers (user_id, sender_name, message) VALUES (?, ?, ?)')
    const result = stmt.run(userId, sanitizedSenderName, sanitizedMessage)

    res.json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Doa berhasil dititipkan'
    })
  } catch (error) {
    console.error('Submit prayer error:', error)
    res.status(500).json({ error: 'Terjadi kesalahan saat menyimpan doa' })
  }
})

// Mark prayer as read
router.post('/mark-read', requireAuth, (req, res) => {
  const { prayer_id } = req.body
  const userId = req.session.user_id

  if (!prayer_id) {
    return res.status(400).json({ error: 'Prayer ID required' })
  }

  // Validate prayer_id is integer
  const prayerId = parseInt(prayer_id, 10)
  if (!prayerId || isNaN(prayerId)) {
    return res.status(400).json({ error: 'Invalid prayer ID' })
  }

  try {
    const stmt = db.prepare('UPDATE prayers SET is_read = 1 WHERE id = ? AND user_id = ?')
    const result = stmt.run(prayerId, userId)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Prayer not found' })
    }

    res.json({ success: true, message: 'Prayer marked as read' })
  } catch (error) {
    console.error('Mark as read error:', error)
    res.status(500).json({ error: 'Database error' })
  }
})

export default router

