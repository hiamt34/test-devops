import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schemas',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5433) ?? 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'postgres',
    database: process.env.DB_NAME ?? 'postgres',
    ssl: false,
  },
});
