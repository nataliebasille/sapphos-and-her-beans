import { type Config } from 'drizzle-kit';

import { env } from '@env';

export default {
  schema: './schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ['sappho_*'],
} satisfies Config;
