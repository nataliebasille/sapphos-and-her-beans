import dotenv from 'dotenv';

const { parsed: env } = dotenv.config({ path: '../.env' });

import { type Config } from 'drizzle-kit';

export default {
  schema: './schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env?.DATABASE_URL ?? '',
  },
  tablesFilter: ['sappho_*'],
} satisfies Config;
