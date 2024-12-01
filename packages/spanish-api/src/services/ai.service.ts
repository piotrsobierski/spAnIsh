import Anthropic from "@anthropic-ai/sdk";
import {
  BatchExamplesResponse,
  RelatedWordsResponse,
  MemoryAssociationsResponse,
} from "../types/ai.types";
import { AI_PROMPTS, AI_CONFIG } from "../constants/ai.constants";

export class AIService {
  private anthropicClient: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_CLAUDE_API_KEY environment variable is not set"
      );
    }
    this.anthropicClient = new Anthropic({ apiKey });
  }

  async generateExamples(
    words: string[],
    targetLang: string = "Spanish",
    sentencesPerWord: number = 3
  ): Promise<BatchExamplesResponse> {
    const limitedWords = words.slice(0, AI_CONFIG.MAX_WORDS_PER_BATCH);

    const response = await this.anthropicClient.messages.create({
      model: process.env.ANTHROPIC_CLAUDE_API_MODEL || AI_CONFIG.DEFAULT_MODEL,
      max_tokens: AI_CONFIG.MAX_TOKENS.BATCH_EXAMPLES,
      messages: [
        {
          role: "user",
          content: AI_PROMPTS.BATCH_EXAMPLES(
            targetLang,
            limitedWords,
            sentencesPerWord
          ),
        },
      ],
    });

    if (response.content[0].type !== "text") {
      throw new Error("Invalid response format");
    }

    return JSON.parse(response.content[0].text);
  }
}
