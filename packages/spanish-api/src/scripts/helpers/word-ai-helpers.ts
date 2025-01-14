import AppDataSource from "../../config/database";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_CLAUDE_API_KEY,
});

export async function getWordDetails(word: string) {
  const result = await AppDataSource.query(
    `SELECT * FROM word WHERE word = ?`,
    [word]
  );

  if (result.length === 0) {
    throw new Error(`No word found with value: ${word}`);
  }

  return result[0];
}

export async function checkTranslation(wordDetails: any) {
  const prompt = `You are a Spanish-English translation expert. Analyze this translation carefully:

Spanish word: "${wordDetails.word}"
Current translation: "${wordDetails.translation}"
Example sentence: "${wordDetails.example}"
Example translation: "${wordDetails.exampleTranslation}"

Your task:
1. Check if the current translation matches how the word is used in the example translation
2. If the current translation is correct AND matches the example usage, you MUST return exactly the same translation
3. Only suggest a different translation if there's a clear mismatch between the current translation and how it's used in the example
4. Your response must be EXACTLY one of these:
   - The exact same translation if it's correct
   - A new translation that better matches the example usage

Return ONLY the translation word/phrase in english, nothing else. No explanations.`;

  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 100,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].type === "text"
    ? response.content[0].text.trim()
    : wordDetails.translation;
}

export async function generateExamplesAndTranslation(wordDetails: any) {
  const prompt = `You are a Spanish-English translation expert. Create an example and translation for this Spanish word:

Spanish word: "${wordDetails.word}"

Your task:
1. Create a natural, everyday example sentence using this word in Spanish
2. Provide an accurate English translation of that sentence
3. Determine the best single-word or short phrase translation for the word itself based on its usage

Format your response EXACTLY like this (including the pipe characters), nothing else:
best_translation|spanish_example|english_example

Example format:
cat|El gato duerme en la cama.|The cat sleeps on the bed.`;

  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 150,
    messages: [{ role: "user", content: prompt }],
  });

  if (response.content[0].type !== "text") {
    throw new Error("Unexpected AI response format");
  }

  const [translation, example, exampleTranslation] = response.content[0].text
    .trim()
    .split("|");
  return { translation, example, exampleTranslation };
}

export async function updateWord(
  word: string,
  updates: {
    translation?: string;
    example?: string;
    exampleTranslation?: string;
  }
) {
  const setFields = [];
  const values = [];

  if (updates.translation) {
    setFields.push("translation = ?");
    values.push(updates.translation);
  }
  if (updates.example) {
    setFields.push("example = ?");
    values.push(updates.example);
  }
  if (updates.exampleTranslation) {
    setFields.push("exampleTranslation = ?");
    values.push(updates.exampleTranslation);
  }

  values.push(word); // for WHERE clause

  const result = await AppDataSource.query(
    `UPDATE word SET ${setFields.join(", ")} WHERE word = ?`,
    values
  );

  if (result.affectedRows === 0) {
    throw new Error(`Failed to update word: ${word}`);
  }
}

export async function initializeDb() {
  await AppDataSource.initialize();
  console.log("Database connection initialized");
}

export async function closeDb() {
  await AppDataSource.destroy();
}

export async function getWordsInRange(startId: number, endId: number) {
  const result = await AppDataSource.query(
    `SELECT * FROM word WHERE id >= ? AND id <= ? ORDER BY id`,
    [startId, endId]
  );

  return result;
}

export function hasValidExamples(wordDetails: any): boolean {
  return (
    wordDetails.example &&
    wordDetails.exampleTranslation &&
    wordDetails.example.trim() !== "" &&
    wordDetails.exampleTranslation.trim() !== ""
  );
}
