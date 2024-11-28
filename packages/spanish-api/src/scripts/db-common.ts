import AppDataSource from "../config/database";

export async function showRows(tableName: string, limit: number) {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    // Get rows with limit
    const rows = await AppDataSource.query(
      `SELECT * FROM \`${tableName}\` LIMIT ?`,
      [limit]
    );

    console.log(`\nTop ${limit} rows from ${tableName}:`);
    if (rows.length === 0) {
      console.log("  No data found");
    } else {
      rows.forEach((row: any, index: number) => {
        console.log(`\nRow ${index + 1}:`);
        Object.entries(row).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await AppDataSource.destroy();
  }
}
