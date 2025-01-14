import { normalizeText, findSeparatorIndex } from "./string-normalizer";

export const checkWordAnswer = (
  wordOriginal: string,
  wordTranslation: string,
  userAnswer: string
): { isCorrect: boolean; isValidFormat: boolean; formatError?: boolean } => {
  if (!userAnswer) {
    return { isCorrect: false, isValidFormat: false };
  }

  const separatorIndex = findSeparatorIndex(userAnswer);
  if (separatorIndex === false) {
    return { isCorrect: false, isValidFormat: false };
  }

  const part1 = normalizeText(userAnswer.slice(0, separatorIndex));
  const part2 = normalizeText(userAnswer.slice(separatorIndex + 1));

  const normalizedOriginal = normalizeText(wordOriginal);
  const normalizedTranslation = normalizeText(wordTranslation);

  const isCorrect =
    (part1 === normalizedOriginal && part2 === normalizedTranslation) ||
    (part1 === normalizedTranslation && part2 === normalizedOriginal);

  return { isCorrect, isValidFormat: true };
};
