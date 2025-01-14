import {
  checkTranslation,
  updateWord,
  initializeDb,
  closeDb,
  getWordsInRange,
} from "./helpers/word-ai-helpers";

async function processWord(wordDetails: any) {
  try {
    const newTranslation = await checkTranslation(wordDetails);

    if (newTranslation === wordDetails.translation) {
      console.log(
        `[ID: ${wordDetails.id}] "${wordDetails.word}" - No changes needed`
      );
      return;
    }

    await updateWord(wordDetails.word, { translation: newTranslation });
    console.log(
      `[ID: ${wordDetails.id}] "${wordDetails.word}" - Updated translation:` +
        `\n  From: "${wordDetails.translation}"` +
        `\n  To:   "${newTranslation}"`
    );
  } catch (error) {
    console.error(
      `[ID: ${wordDetails.id}] Error processing "${wordDetails.word}":`,
      error
    );
  }
}

async function fixWordsWithAI(startId: number, endId: number) {
  try {
    await initializeDb();

    const words = await getWordsInRange(startId, endId);
    console.log(`Found ${words.length} words to process\n`);

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
  console.log("Usage: npm run db:fixwordsai <startId> <endId>");
  console.log("Example: npm run db:fixwordsai 1 10");
  process.exit(1);
}

fixWordsWithAI(startId, endId);
