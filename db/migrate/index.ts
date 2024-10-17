import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from '../index';

if (process.env.NODE_ENV !== 'production') {
  throw new Error(
    'Migrations can only be run in production. In development use `db:push` instead.'
  );
}

const main = async () => {
  try {
    await migrate(db as unknown as NeonHttpDatabase<any>, {
      migrationsFolder: './db/migrate/migrations',
    });
    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};
main();
