export const AI_PROMPTS = {
  BATCH_EXAMPLES: (
    targetLang: string,
    words: string[],
    sentencesPerWord: number
  ) => `
    For each of these ${targetLang} words: ${words.join(", ")}, 
    provide exactly ${sentencesPerWord} simple example sentences.
    Format the response as JSON with this structure:
    {
      "examples": [
        {
          "word": "word1",
          "sentences": [
            {"original": "sentence in ${targetLang}", "english": "english translation"}
          ]
        }
      ]
    }
    Only respond with valid JSON, no additional text or explanations.`,

  RELATED_WORDS: (targetLang: string, word: string) => `
    There is a ${targetLang} word '${word}' - I want you to give me all related words along with their translation to English and explanation if needed.
    Format the response as JSON with this structure:
    {
      "word": "${word}",
      "category": "category name",
      "related_words": [
        {
          "${targetLang.toLowerCase()}": "related word in ${targetLang}",
          "english": "English translation",
          "explanation": "optional explanation if needed"
        }
      ]
    }`,

  MEMORY_ASSOCIATIONS: (targetLang: string, word: string) => `
    For the ${targetLang} word '${word}', provide 3 memory association tips to help remember its meaning.
    Format the response as JSON with this structure:
    {
      "memory_tips": [
        {
          "type": "type of association",
          "tip": "detailed explanation of the memory association"
        }
      ]
    }`,
};

export const AI_CONFIG = {
  DEFAULT_MODEL: "claude-3-haiku-20240307",
  MAX_TOKENS: {
    BATCH_EXAMPLES: 1500,
    RELATED_WORDS: 800,
    MEMORY_ASSOCIATIONS: 500,
  },
  MAX_WORDS_PER_BATCH: 10,
};
