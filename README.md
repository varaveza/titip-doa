# Umrah Prayer Request Application

Aplikasi web untuk sistem titip doa Umrah dengan React frontend dan Express.js backend.

## Struktur Project

```
doa/
├── react/          # React Frontend Application
├── api-express/   # Express.js Backend API
└── README.md      # This file
```

## Tech Stack

### Frontend (React)
- React 18
- React Router
- Tailwind CSS
- Vite
- Axios

### Backend (Express)
- Express.js
- SQLite (better-sqlite3)
- bcrypt (password hashing)
- express-session

## Quick Start

### Install Dependencies (Sekaligus)

Dari root folder `doa`:
```bash
npm run install:all
```

Atau install manual:
```bash
npm install
cd api-express && npm install && cd ..
cd react && npm install && cd ..
```

### Setup Environment Variables

**Backend** (`api-express/.env`):
```
PORT=3001
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

**Frontend** (`react/.env`):
```
VITE_API_URL=http://localhost:3001
```

### Run Development (Backend + Frontend)

Dari root folder `doa`:
```bash
npm run dev
```

Ini akan menjalankan:
- Backend API di `http://localhost:3001`
- Frontend React di `http://localhost:3000`

### Run Production

1. Build frontend:
```bash
npm run build
```

2. Start production:
```bash
npm start
```

## Manual Setup (Jika Perlu)

### Backend API

1. Masuk ke folder api-express:
```bash
cd api-express
```

2. Install dependencies:
```bash
npm install
```

3. Buat file `.env`:
```
PORT=3001
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

4. Jalankan server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

### Frontend React

1. Masuk ke folder react:
```bash
cd react
```

2. Install dependencies:
```bash
npm install
```

3. Buat file `.env`:
```
VITE_API_URL=http://localhost:3001
```

4. Jalankan development server:
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Security Features

- ✅ SQL Injection Protection (Prepared Statements)
- ✅ XSS Protection (Input sanitization + React auto-escape)
- ✅ Input Validation & Sanitization
- ✅ Password Hashing (bcrypt)
- ✅ Session Management
- ✅ CORS Configuration

## Database

Database SQLite akan dibuat otomatis di: `../db_doa/umrah.sqlite`

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

## License

Dibuat dengan tulus untuk para tamu Allah.

