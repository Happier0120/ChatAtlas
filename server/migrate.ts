import { defaultDatabasePath, openDatabase } from './database.ts';

const databasePath = process.env.CHATATLAS_DB ?? defaultDatabasePath;
const database = openDatabase(databasePath);
database.close();
console.log(`SQLite migrations applied: ${databasePath}`);
