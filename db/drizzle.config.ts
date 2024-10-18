import dotenv from 'dotenv';

const envPath =
  process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env';
const { parsed: env } = dotenv.config({ path: `../${envPath}` });
console.log(process.env.DATABASE_URL);
import { type Config } from 'drizzle-kit';

export default {
  schema: './schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env?.DATABASE_URL ?? '',
  },
  tablesFilter: ['sappho_*'],
  out: './migrate/migrations',
} satisfies Config;
