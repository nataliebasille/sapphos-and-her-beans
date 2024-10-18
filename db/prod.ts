import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Client } from '@neondatabase/serverless';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as path from 'node:path';

neonConfig.webSocketConstructor = ws;
dotenv.config({ path: path.join(__dirname, '../.env.production.local') });
const client = new Client({ connectionString: process.env.DATABASE_URL! });
client.connect((err) => {
  if (err) console.error(err);
});
export const db = drizzle(client, { logger: true });
