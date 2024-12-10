/**
 * Removes diacritics (accent marks) from Spanish characters
 */
export const removeDiacritics = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Normalizes input string by:
 * 1. Converting to lowercase
 * 2. Removing diacritics
 * 3. Normalizing spaces around hyphens
 * 4. Normalizing multiple spaces to single space
 * 5. Sorting words to allow any order
 */
export const normalizeAnswer = (str: string): string => {
  console.log("Input:", str);

  const normalized = removeDiacritics(str.toLowerCase())
    .trim()
    .replace(/\s*-\s*/g, "-")
    .split(/\s+/)
    .join(" ");

  console.log("After first normalization:", normalized);

  // Split by either space or hyphen and sort words
  const words = normalized.split(/[\s-]+/);
  console.log("Words after split:", words);

  // If input is a single word, check if it matches either part of the answer
  if (words.length === 1) {
    return words[0];
  }

  // Otherwise sort and join with hyphen
  const result = words.sort().join("-");
  console.log("Final result:", result);

  return result;
};

/**
 * Validates if the input string matches the expected format:
 * word1 - word2 or word1 word2 or word1-word2
 * Allows any order of words
 */
export const isValidAnswerFormat = (input: string): boolean => {
  const trimmed = input.trim();
  // Split into parts by spaces or hyphens
  const parts = trimmed.split(/[\s-]+/);

  // Allow either 1 or 2 parts
  if (parts.length !== 1 && parts.length !== 2) return false;

  // Each part must contain only letters and Spanish characters
  const wordRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+$/;
  return parts.every((part) => wordRegex.test(part));
};
