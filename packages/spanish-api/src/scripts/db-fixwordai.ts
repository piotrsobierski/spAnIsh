import {
  getWordDetails,
  checkTranslation,
  updateWord,
  initializeDb,
  closeDb,
} from "./helpers/word-ai-helpers";

async function fixWordWithAI(word: string) {
  try {
    await initializeDb();

    // 1. Get current word details
    const wordDetails = await getWordDetails(word);
    console.log("\nCurrent word details:");
    Object.entries(wordDetails).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

    // 2. Get AI suggestion
    console.log("\nQuerying AI for translation improvement...");
    const newTranslation = await checkTranslation(wordDetails);
    console.log(`AI suggested translation: "${newTranslation}"`);

    if (newTranslation === wordDetails.translation) {
      console.log("\nAI confirms the current translation is optimal.");
      return;
    }

    // 3. Update the translation
    await updateWord(word, { translation: newTranslation });
    console.log(
      `\nSuccessfully updated translation for '${word}' to '${newTranslation}'`
    );

    // 4. Show updated word
    const updatedWord = await getWordDetails(word);
    console.log("\nUpdated word details:");
    Object.entries(updatedWord).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await closeDb();
  }
}

// Get word from command line argument
const word = process.argv[2];
if (!word) {
  console.error("Please provide a word as an argument");
  console.log("Usage: npm run db:fixwordai <word>");
  console.log("Example: npm run db:fixwordai gato");
  process.exit(1);
}

fixWordWithAI(word);
