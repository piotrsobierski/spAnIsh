require('dotenv').config();
const mariadb = require('mariadb');

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const fs = require('fs').promises;
const path = require('path');

async function executeSqlFile(sqlFile) {
  const pool = mariadb.createPool({
    host: DB_HOST,
    port: parseInt(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true
  });

  try {
    const filePath = path.join(__dirname, sqlFile);
    const sqlContent = await fs.readFile(filePath, 'utf8');
    const conn = await pool.getConnection();
    
    try {
      // Execute the SQL statements and store the results
      const results = await conn.query(sqlContent);
      
      // If results is an array (multiple statements) or has rows, display them
      if (Array.isArray(results)) {
        results.forEach((result, index) => {
          if (result.length > 0) {
            console.log('\nResult set', index + 1);
            console.table(result);
          }
        });
      } else if (results.length > 0) {
        console.table(results);
      }
      
      console.log('Database operation completed successfully');
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error('Error executing SQL:', err);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your MariaDB server is running');
    console.log('2. Verify your connection details in .env file');
    console.log(`3. Database connection details being used:`);
    console.log(`   Host: ${DB_HOST}`);
    console.log(`   Port: ${DB_PORT}`);
    console.log(`   User: ${DB_USER}`);
    console.log(`   Database: ${DB_NAME}`);
  } finally {
    await pool.end();
  }
}

const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error('Please provide SQL file name as argument');
  process.exit(1);
}

executeSqlFile(sqlFile); 