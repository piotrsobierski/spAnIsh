export const WORDS = {
  POOL_SIZE: 70,
  VALIDATION: {
    SEPARATOR: {
      HYPHEN: "-",
      DOUBLE_SPACE: "  ",
    },
    FORMAT: {
      ERROR_MESSAGE:
        "Invalid format. Use hyphen (-) or double space between English and Spanish",
      HELP_MESSAGE:
        "Format: english - spanish (or english  spanish with double space)",
      PLACEHOLDER: "Type your answer (english - spanish)",
    },
  },
  FEEDBACK: {
    CORRECT: "Correct :) !",
    WRONG: "Wrong",
  },
  IMAGE: {
    MAX_WIDTH: "200px",
  },
} as const;
