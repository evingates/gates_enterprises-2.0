const fs = require('fs');
const path = require('path');
const { pool } = require('./server/src/config/db');

async function runMigrations() {
  console.log('Starting execution of schema.sql...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the SQL queries
    await pool.query(schema);
    
    console.log('✅ Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error executing DB migrations:', error);
    process.exit(1);
  }
}

runMigrations();
