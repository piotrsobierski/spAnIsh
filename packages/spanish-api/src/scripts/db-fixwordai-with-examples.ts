import {
  getWordDetails,
  checkTranslation,
  generateExamplesAndTranslation,
  updateWord,
  initializeDb,
  closeDb,
  hasValidExamples,
} from "./helpers/word-ai-helpers";

async function fixWordWithExamples(word: string) {
  try {
    await initializeDb();

    // 1. Get current word details
    const wordDetails = await getWordDetails(word);
    console.log("\nCurrent word details:");
    Object.entries(wordDetails).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

    if (hasValidExamples(wordDetails)) {
      // 2a. If we have examples, just check and fix translation
      console.log("\nChecking translation against existing examples...");
      const newTranslation = await checkTranslation(wordDetails);

      if (newTranslation === wordDetails.translation) {
        console.log("Translation is optimal for the current examples.");
        return;
      }

      await updateWord(word, { translation: newTranslation });
      console.log(
        `Updated translation from "${wordDetails.translation}" to "${newTranslation}"`
      );
    } else {
      // 2b. If we don't have examples, generate everything
      console.log("\nGenerating examples and translation...");
      const { translation, example, exampleTranslation } =
        await generateExamplesAndTranslation(wordDetails);

      await updateWord(word, {
        translation,
        example,
        exampleTranslation,
      });

      console.log("Generated and updated:");
      console.log(`  Translation: "${translation}"`);
      console.log(`  Example: "${example}"`);
      console.log(`  Example Translation: "${exampleTranslation}"`);
    }

    // 3. Show final state
    const updatedWord = await getWordDetails(word);
    console.log("\nFinal word details:");
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
  console.log("Usage: npm run db:fixwordai-with-examples <word>");
  console.log("Example: npm run db:fixwordai-with-examples gato");
  process.exit(1);
}

fixWordWithExamples(word);
