import AppDataSource from "../config/database";

async function showTables() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    const tables = await AppDataSource.query(`
      SELECT TABLE_NAME 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME}'
    `);

    console.log("\nDatabase tables:");
    tables.forEach((table: any) => {
      console.log(`- ${table.TABLE_NAME || table.table_name}`);
    });

    // Also show table details
    for (const table of tables) {
      const tableName = table.TABLE_NAME || table.table_name;
      const columns = await AppDataSource.query(`
        SHOW COLUMNS FROM \`${tableName}\`
      `);

      console.log(`\nTable: ${tableName}`);
      columns.forEach((col: any) => {
        console.log(
          `  - ${col.Field}: ${col.Type} ${
            col.Null === "YES" ? "(nullable)" : ""
          }`
        );
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

showTables();
