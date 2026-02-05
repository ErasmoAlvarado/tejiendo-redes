import { loadEnvConfig } from '@next/env';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function reset() {
    try {
        const { connection } = await import('./client');
        const db = drizzle(connection);

        console.log('🗑️ Resetting database...');

        // Disable foreign key checks
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);

        // Get all tables
        const [rows] = await db.execute(sql`SHOW TABLES`);

        if (Array.isArray(rows)) {
            for (const row of rows) {
                const tableName = Object.values(row)[0] as string;
                console.log(`Dropping table: ${tableName}`);
                await db.execute(sql.raw(`DROP TABLE IF EXISTS \`${tableName}\``));
            }
        }

        // Enable foreign key checks
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

        console.log('✅ Database reset successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Reset failed:', error);
        process.exit(1);
    }
}

reset();
