import { WORDS } from "../constants/app.constants";

/**
 * Removes diacritics (accent marks) from Spanish characters
 */
export const removeDiacritics = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Normalizes text for comparison by:
 * - Converting to lowercase
 * - Removing diacritics
 * - Trimming spaces
 */
export const normalizeText = (str: string): string => {
  return removeDiacritics(str.toLowerCase()).trim();
};

/**
 * Validates if the input string has valid format and finds the separator
 * Returns false if invalid, or the index of the separator if valid
 */
export const findSeparatorIndex = (input: string): number | false => {
  const hyphenIndex = input.indexOf(WORDS.VALIDATION.SEPARATOR.HYPHEN);
  if (hyphenIndex !== -1) {
    if (input.lastIndexOf(WORDS.VALIDATION.SEPARATOR.HYPHEN) !== hyphenIndex)
      return false;
    return hyphenIndex;
  }

  const doubleSpaceIndex = input.indexOf(
    WORDS.VALIDATION.SEPARATOR.DOUBLE_SPACE
  );
  if (doubleSpaceIndex !== -1) {
    return doubleSpaceIndex;
  }

  // Check for single space if no hyphen or double space found
  const spaceIndex = input.indexOf(" ");
  if (spaceIndex !== -1 && input.lastIndexOf(" ") === spaceIndex) {
    return spaceIndex;
  }

  return false;
};

/**
 * Validates if the input string has a valid format
 */
export const isValidAnswerFormat = (input: string): boolean => {
  const separatorIndex = findSeparatorIndex(input);
  if (separatorIndex === false) return false;

  const part1 = input.slice(0, separatorIndex).trim();
  const part2 = input.slice(separatorIndex + 1).trim();

  return part1.length > 0 && part2.length > 0;
};

/**
 * Normalizes input string for storage/comparison
 */
export const normalizeAnswer = (str: string): string => {
  const separatorIndex = findSeparatorIndex(str);
  if (separatorIndex === false) return str.trim();

  const part1 = str.slice(0, separatorIndex).trim();
  const part2 = str.slice(separatorIndex + 1).trim();

  return `${part1} - ${part2}`;
};
