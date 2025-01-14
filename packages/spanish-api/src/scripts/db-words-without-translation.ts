import AppDataSource from "../config/database";
import dotenv from "dotenv";

dotenv.config();

async function findWordsWithoutTranslation() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    const words = await AppDataSource.query(`
      SELECT id, word, translation, example, exampleTranslation 
      FROM word 
      WHERE translation IS NULL 
         OR translation = '' 
         OR example IS NULL 
         OR example = '' 
         OR exampleTranslation IS NULL 
         OR exampleTranslation = ''
      ORDER BY id
    `);

    if (words.length === 0) {
      console.log("\nNo words found missing translations or examples!");
      return;
    }

    console.log(`\nFound ${words.length} words with missing data:\n`);
    words.forEach((word: any) => {
      console.log(`[ID: ${word.id}] "${word.word}"`);
      if (!word.translation || word.translation === "") {
        console.log("  Missing translation");
      }
      if (!word.example || word.example === "") {
        console.log("  Missing example");
      }
      if (!word.exampleTranslation || word.exampleTranslation === "") {
        console.log("  Missing example translation");
      }
      console.log(""); // Empty line for readability
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

findWordsWithoutTranslation();
