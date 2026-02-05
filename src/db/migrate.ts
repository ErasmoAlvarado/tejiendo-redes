import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';

// Load environment variables configuration
const projectDir = process.cwd();
loadEnvConfig(projectDir);

/**
 * Script to run database migrations
 * Usage: tsx src/db/migrate.ts
 */
async function runMigrations() {
    console.log('⏳ Running database migrations...');

    try {
        // Dynamically import client to ensure env vars are loaded before the module is evaluated
        const { connection } = await import('./client');

        const db = drizzle(connection);
        await migrate(db, { migrationsFolder: './drizzle' });

        console.log('✅ Migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();
