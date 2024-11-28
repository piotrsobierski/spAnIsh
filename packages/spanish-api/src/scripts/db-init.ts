import AppDataSource from "../config/database";

async function initDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    // Synchronize database schema
    await AppDataSource.synchronize();
    console.log("Database schema synchronized");

    // Run migrations
    await AppDataSource.runMigrations();
    console.log("Migrations applied");

    // Show current tables
    const tables = await AppDataSource.query(
      `SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ?`,
      [process.env.DB_NAME]
    );

    console.log("\nCreated tables:");
    tables.forEach((table: any) => {
      console.log(`- ${table.TABLE_NAME}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Add confirmation prompt
if (process.argv.includes("--force")) {
  initDatabase();
} else {
  console.error("This will create all tables and run migrations!");
  console.error("To proceed, run with --force flag:");
  console.error("npm run db:init -- --force");
}
