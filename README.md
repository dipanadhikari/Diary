# Site Diary

This workspace contains a full-stack site diary application scaffold based on the SCS JV industrial placement design.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL-ready with SQL schema and pg pool configuration
- Storage: local uploads directory for image files

## Quick start

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

A demo login is available in development mode:

- Email: admin@site-diary.com
- Password: password123

The application uses a PostgreSQL design document and includes a migration file under `server/src/db/migrations/001_init.sql`.
