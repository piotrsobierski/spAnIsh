import AppDataSource from "../config/database";

async function fixWord(word: string, newTranslation: string) {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    const result = await AppDataSource.query(
      `UPDATE word SET translation = ? WHERE word = ?`,
      [newTranslation, word]
    );

    if (result.affectedRows === 0) {
      console.log(`No word found with value: ${word}`);
      return;
    }

    console.log(
      `Successfully updated translation for word '${word}' to '${newTranslation}'`
    );

    // Show updated word
    const updatedWord = await AppDataSource.query(
      `SELECT * FROM word WHERE word = ?`,
      [word]
    );

    console.log("\nUpdated word details:");
    Object.entries(updatedWord[0]).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Get word and new translation from command line arguments
const word = process.argv[2];
const newTranslation = process.argv[3];

if (!word || !newTranslation) {
  console.error("Please provide both word and new translation as arguments");
  console.log("Usage: npm run db:fixword <word> <newTranslation>");
  console.log("Example: npm run db:fixword gato cat");
  process.exit(1);
}

fixWord(word, newTranslation);
