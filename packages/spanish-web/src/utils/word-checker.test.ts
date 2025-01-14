import { checkWordAnswer } from "./word-checker";

describe("checkWordAnswer", () => {
  it("should return correct result for valid spanish-english answer with hyphen", () => {
    const result = checkWordAnswer("casa", "house", "casa - house");
    expect(result).toEqual({
      isCorrect: true,
      isValidFormat: true,
    });
  });

  it("should return correct result for valid english-spanish answer with hyphen", () => {
    const result = checkWordAnswer("casa", "house", "house - casa");
    expect(result).toEqual({
      isCorrect: true,
      isValidFormat: true,
    });
  });

  it("should return correct result for spanish-english answer with single space", () => {
    const result = checkWordAnswer("casa", "house", "casa house");
    expect(result).toEqual({
      isCorrect: true,
      isValidFormat: true,
    });
  });

  it("should return correct result for english-spanish answer with single space", () => {
    const result = checkWordAnswer("casa", "house", "house casa");
    expect(result).toEqual({
      isCorrect: true,
      isValidFormat: true,
    });
  });

  it("should handle multi-word spanish phrase with hyphen", () => {
    const result = checkWordAnswer(
      "el hombre",
      "the man",
      "el hombre - the man"
    );
    expect(result).toEqual({
      isCorrect: true,
      isValidFormat: true,
    });
  });

  it("should handle multi-word english phrase with hyphen", () => {
    const result = checkWordAnswer(
      "el hombre",
      "the man",
      "the man - el hombre"
    );
    expect(result).toEqual({
      isCorrect: true,
      isValidFormat: true,
    });
  });

  it("should handle multi-word phrases with single space", () => {
    const result = checkWordAnswer(
      "el hombre",
      "the man",
      "el hombre  the man"
    );
    expect(result).toEqual({
      isCorrect: true,
      isValidFormat: true,
    });
  });

  it("should handle multi-word phrases with double space", () => {
    const result = checkWordAnswer(
      "el hombre",
      "the man",
      "el hombre  the man"
    );
    expect(result).toEqual({
      isCorrect: true,
      isValidFormat: true,
    });
  });

  it("should return false for incorrect multi-word answer", () => {
    const result = checkWordAnswer("el hombre", "the man", "el hombre - a man");
    expect(result).toEqual({
      isCorrect: false,
      isValidFormat: true,
    });
  });

  it("should return false for incorrect answer", () => {
    const result = checkWordAnswer("casa", "house", "casa - car");
    expect(result).toEqual({
      isCorrect: false,
      isValidFormat: true,
    });
  });

  it("should handle empty input", () => {
    const result = checkWordAnswer("casa", "house", "");
    expect(result).toEqual({
      isCorrect: false,
      isValidFormat: false,
    });
  });

  it("should handle double space separator with spanish-english order", () => {
    const result = checkWordAnswer("casa", "house", "casa  house");
    expect(result).toEqual({
      isCorrect: true,
      isValidFormat: true,
    });
  });

  it("should handle double space separator with english-spanish order", () => {
    const result = checkWordAnswer("casa", "house", "house  casa");
    expect(result).toEqual({
      isCorrect: true,
      isValidFormat: true,
    });
  });
});
