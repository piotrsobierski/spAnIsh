import {
  checkTranslation,
  generateExamplesAndTranslation,
  updateWord,
  initializeDb,
  closeDb,
  getWordsInRange,
  hasValidExamples,
} from "./helpers/word-ai-helpers";

async function processWord(wordDetails: any) {
  try {
    console.log(
      `\n[ID: ${wordDetails.id}] Processing "${wordDetails.word}"...`
    );

    if (hasValidExamples(wordDetails)) {
      // If we have examples, check and fix translation
      console.log("  Has valid examples, checking translation...");
      const newTranslation = await checkTranslation(wordDetails);

      if (newTranslation === wordDetails.translation) {
        console.log("  Translation is optimal for current examples");
        return;
      }

      await updateWord(wordDetails.word, { translation: newTranslation });
      console.log(
        `  Updated translation:\n` +
          `    From: "${wordDetails.translation}"\n` +
          `    To:   "${newTranslation}"`
      );
    } else {
      // If we don't have examples, generate everything
      console.log("  Missing examples, generating new content...");
      const { translation, example, exampleTranslation } =
        await generateExamplesAndTranslation(wordDetails);

      await updateWord(wordDetails.word, {
        translation,
        example,
        exampleTranslation,
      });

      console.log("  Generated and updated:");
      console.log(`    Translation: "${translation}"`);
      console.log(`    Example: "${example}"`);
      console.log(`    Example Translation: "${exampleTranslation}"`);
    }
  } catch (error) {
    console.error(`  Error processing "${wordDetails.word}":`, error);
  }
}

async function fixWordsWithExamples(startId: number, endId: number) {
  try {
    await initializeDb();

    const words = await getWordsInRange(startId, endId);
    console.log(`Found ${words.length} words to process`);

    for (const word of words) {
      await processWord(word);
    }

    console.log("\nProcessing completed!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await closeDb();
  }
}

// Get ID range from command line arguments
const startId = parseInt(process.argv[2], 10);
const endId = parseInt(process.argv[3], 10);

if (isNaN(startId) || isNaN(endId) || startId > endId) {
  console.error("Please provide valid start and end IDs");
  console.log("Usage: npm run db:fixwordsai-with-examples <startId> <endId>");
  console.log("Example: npm run db:fixwordsai-with-examples 1 10");
  process.exit(1);
}

fixWordsWithExamples(startId, endId);
