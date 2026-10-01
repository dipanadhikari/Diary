import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/site_diary',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
