# Umrah Prayer Request API - Express.js

Backend API menggunakan Express.js dan SQLite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env` (optional):
```
PORT=3001
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

3. Jalankan server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/check` - Check auth status
- `POST /api/auth/logout` - Logout

### User
- `GET /api/user/:username` - Get user by username

### Prayer
- `GET /api/prayer?tab=unread` - Get prayers (requires auth)
- `POST /api/prayer/submit` - Submit prayer (public)
- `POST /api/prayer/mark-read` - Mark as read (requires auth)

## Database

Database SQLite akan dibuat di: `db_doa/umrah.sqlite` (sama dengan PHP version)

