import express from 'express'
import cors from 'cors'
import session from 'express-session'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import prayerRoutes from './routes/prayer.js'
import { initDatabase } from './db/database.js'

const app = express()
const PORT = process.env.PORT || 3001

// Initialize database
initDatabase()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'bismillah221-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/prayer', prayerRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

