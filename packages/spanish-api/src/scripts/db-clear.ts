import AppDataSource from "../config/database";

async function clearDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    // Disable foreign key checks temporarily
    await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 0");

    // Get all tables
    const tables = await AppDataSource.query(
      `
      SELECT TABLE_NAME 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `,
      [process.env.DB_NAME]
    );

    // Drop each table
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      await AppDataSource.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      console.log(`Dropped table: ${tableName}`);
    }

    // Re-enable foreign key checks
    await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("\nDatabase cleared successfully!");
    console.log("\nTo recreate the database:");
    console.log("1. npm run migration:run");
    console.log("2. npm run db:status (to verify)");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Add confirmation prompt
if (process.argv.includes("--force")) {
  clearDatabase();
} else {
  console.error("This will DELETE ALL TABLES AND DATA!");
  console.error("To proceed, run with --force flag:");
  console.error("npm run db:clear -- --force");
}
