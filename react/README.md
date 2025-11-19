# Umrah Prayer Request - React App

Aplikasi React untuk sistem titip doa Umrah.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env` di root folder:
```
VITE_API_URL=http://localhost:3001
```

3. Jalankan development server:
```bash
npm run dev
```

4. Build untuk production:
```bash
npm run build
```

## Backend API

Aplikasi ini menggunakan Express.js API (lihat folder `../api-express`).

Pastikan Express API server berjalan di port 3001 sebelum menjalankan React app.

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register  
- `GET /api/auth/check` - Check auth status
- `POST /api/auth/logout` - Logout
- `GET /api/user/:username` - Get user info
- `GET /api/prayer?tab=unread` - Get prayers
- `POST /api/prayer/submit` - Submit prayer
- `POST /api/prayer/mark-read` - Mark as read

