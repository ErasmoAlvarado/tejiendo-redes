import { loadEnvConfig } from '@next/env';
import { sql } from 'drizzle-orm';

// Load environment variables configuration
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function reset() {
    console.log('🗑️ Resetting database...');
    try {
        const { db } = await import('./index');

        // Disable foreign key checks
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);

        // Get all tables
        const result = await db.execute(sql`
            SELECT table_name as tableName
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
        `);

        // The result structure depends on the driver, but for mysql2 with drizzle it's usually [rows, fields]
        // or just rows if using db.execute() which returns the driver's raw result.
        // Let's assume it's standard mysql2 query result: [RowDataPacket[], FieldPacket[]]

        const rows = result[0] as any[];

        if (Array.isArray(rows)) {
            for (const row of rows) {
                const tableName = row.tableName || row.TABLE_NAME;
                if (tableName) {
                    console.log(`Dropping table: ${tableName}`);
                    await db.execute(sql.raw(`DROP TABLE IF EXISTS \`${tableName}\``));
                }
            }
        }

        // Re-enable foreign key checks
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

        console.log('✅ Database reset complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}

reset();
