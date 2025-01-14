import AppDataSource from "../config/database";

async function getWord(word: string) {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    const result = await AppDataSource.query(
      `SELECT * FROM word WHERE word = ?`,
      [word]
    );

    if (result.length === 0) {
      console.log(`No word found with value: ${word}`);
      return;
    }

    console.log("\nWord details:");
    Object.entries(result[0]).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Get word from command line argument
const word = process.argv[2];
if (!word) {
  console.error("Please provide a word as an argument");
  console.log("Usage: npm run db:getword <word>");
  console.log("Example: npm run db:getword gato");
  process.exit(1);
}

getWord(word);
