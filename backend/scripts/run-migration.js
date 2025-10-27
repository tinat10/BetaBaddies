import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import database from '../services/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Starting OAuth migration...\n');

    // Read the migration file
    const migrationPath = path.join(__dirname, '../../db/oauth_migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolons to execute each statement separately
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (!statement || statement.startsWith('--')) continue;

      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        await database.query(statement);
        console.log(`✅ Statement ${i + 1} executed successfully\n`);
      } catch (error) {
        // Ignore "already exists" errors for idempotency
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Statement ${i + 1} skipped (already exists)\n`);
        } else {
          throw error;
        }
      }
    }

    console.log('✅ OAuth migration completed successfully!\n');

    // Verify tables exist
    console.log('🔍 Verifying migration...\n');
    
    const verification = await database.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('oauth_accounts', 'users', 'profiles') 
      ORDER BY table_name
    `);

    console.log('📊 Tables found:');
    verification.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    console.log('\n🎉 Migration completed! You can now use OAuth authentication.\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

runMigration();

