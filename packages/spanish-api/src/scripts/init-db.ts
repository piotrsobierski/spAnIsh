import AppDataSource from "../config/database";
import { Category } from "../entities/Category";

async function initDb() {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    // Sync schema (this will create tables)
    await AppDataSource.synchronize(true); // true means drop existing tables
    console.log("Database schema synchronized");

    // Add some initial categories
    const categoryRepository = AppDataSource.getRepository(Category);
    await categoryRepository.save([
      { name: "Verbs" },
      { name: "Nouns" },
      { name: "Adjectives" },
    ]);
    console.log("Initial categories created");
  } catch (error) {
    console.error("Error during initialization:", error);
  } finally {
    // Close the connection
    await AppDataSource.destroy();
  }
}

initDb();
