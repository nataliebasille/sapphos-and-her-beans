import { type db as Db } from './dev';
import * as schema from './schema';

const db: typeof Db =
  process.env.NODE_ENV === 'production'
    ? require('./prod').db
    : require('./dev').db;

export { db, schema };
