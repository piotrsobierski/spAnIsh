import { Request, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import {
  BatchExamplesRequest,
  BatchExamplesResponse,
  WordRequest,
  RelatedWordsResponse,
  MemoryAssociationsResponse,
} from "../types/ai.types";
import { AI_PROMPTS, AI_CONFIG } from "../constants/ai.constants";

export class AIController {
  private getAnthropicClient() {
    const apiKey = process.env.ANTHROPIC_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_CLAUDE_API_KEY environment variable is not set"
      );
    }
    return new Anthropic({ apiKey });
  }

  /**
   * @swagger
   * /ai/generate-examples:
   *   post:
   *     summary: Generate example sentences for multiple words
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               words:
   *                 type: array
   *                 items:
   *                   type: string
   *               targetLang:
   *                 type: string
   *               sentencesPerWord:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Example sentences retrieved successfully
   *       400:
   *         description: Invalid request
   *       500:
   *         description: Server error
   */
  generateExampleSentences = async (
    req: Request<{}, {}, BatchExamplesRequest>,
    res: Response
  ) => {
    try {
      const anthropic = this.getAnthropicClient();
      const { words, targetLang = "Spanish", sentencesPerWord = 3 } = req.body;

      if (!Array.isArray(words) || words.length === 0) {
        return res.status(400).json({ error: "Words array is required" });
      }

      const limitedWords = words.slice(0, AI_CONFIG.MAX_WORDS_PER_BATCH);

      const response = await anthropic.messages.create({
        model:
          process.env.ANTHROPIC_CLAUDE_API_MODEL || AI_CONFIG.DEFAULT_MODEL,
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

      const content = response.content[0];
      if (content.type === "text") {
        console.log("Raw API response:", content.text);
        try {
          const result = JSON.parse(content.text) as BatchExamplesResponse;
          res.json(result);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          console.error("Attempted to parse:", content.text);
          res.status(500).json({
            error: "Failed to parse API response",
            details:
              process.env.NODE_ENV === "development" ? content.text : undefined,
          });
        }
      } else {
        throw new Error("Unexpected content type in response");
      }
    } catch (error) {
      console.error("Error in generateExampleSentences:", error);
      if (
        error instanceof Error &&
        error.message.includes("ANTHROPIC_CLAUDE_API_KEY")
      ) {
        return res.status(500).json({ error: "API configuration error" });
      }
      res.status(500).json({
        error: "Failed to get example sentences",
        details: error instanceof Error ? error.message : undefined,
      });
    }
  };

  /**
   * @swagger
   * /ai/generate-related-words:
   *   post:
   *     summary: Generate related words for a given word
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               word:
   *                 type: string
   *               targetLang:
   *                 type: string
   *     responses:
   *       200:
   *         description: Related words retrieved successfully
   *       400:
   *         description: Invalid request
   *       500:
   *         description: Server error
   */
  generateRelatedWords = async (
    req: Request<{}, {}, WordRequest>,
    res: Response
  ) => {
    try {
      const anthropic = this.getAnthropicClient();
      const { word, targetLang = "Spanish" } = req.body;

      if (!word) {
        return res.status(400).json({ error: "Word is required" });
      }

      const response = await anthropic.messages.create({
        model:
          process.env.ANTHROPIC_CLAUDE_API_MODEL || AI_CONFIG.DEFAULT_MODEL,
        max_tokens: AI_CONFIG.MAX_TOKENS.RELATED_WORDS,
        messages: [
          {
            role: "user",
            content: AI_PROMPTS.RELATED_WORDS(targetLang, word),
          },
        ],
      });

      const content = response.content[0];
      if (content.type === "text") {
        const result = JSON.parse(content.text) as RelatedWordsResponse;
        res.json(result);
      } else {
        throw new Error("Unexpected content type in response");
      }
    } catch (error) {
      console.error("Error in generateRelatedWords:", error);
      if (
        error instanceof Error &&
        error.message.includes("ANTHROPIC_CLAUDE_API_KEY")
      ) {
        return res.status(500).json({ error: "API configuration error" });
      }
      res.status(500).json({ error: "Failed to get related words" });
    }
  };

  /**
   * @swagger
   * /ai/generate-memory-associations:
   *   post:
   *     summary: Generate memory association tips for a word
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               word:
   *                 type: string
   *               targetLang:
   *                 type: string
   *     responses:
   *       200:
   *         description: Memory tips retrieved successfully
   *       400:
   *         description: Invalid request
   *       500:
   *         description: Server error
   */
  generateMemoryAssociations = async (
    req: Request<{}, {}, WordRequest>,
    res: Response
  ) => {
    try {
      const anthropic = this.getAnthropicClient();
      const { word, targetLang = "Spanish" } = req.body;

      if (!word) {
        return res.status(400).json({ error: "Word is required" });
      }

      const response = await anthropic.messages.create({
        model:
          process.env.ANTHROPIC_CLAUDE_API_MODEL || AI_CONFIG.DEFAULT_MODEL,
        max_tokens: AI_CONFIG.MAX_TOKENS.MEMORY_ASSOCIATIONS,
        messages: [
          {
            role: "user",
            content: AI_PROMPTS.MEMORY_ASSOCIATIONS(targetLang, word),
          },
        ],
      });

      const content = response.content[0];
      if (content.type === "text") {
        const result = JSON.parse(content.text) as MemoryAssociationsResponse;
        res.json(result);
      } else {
        throw new Error("Unexpected content type in response");
      }
    } catch (error) {
      console.error("Error in generateMemoryAssociations:", error);
      if (
        error instanceof Error &&
        error.message.includes("ANTHROPIC_CLAUDE_API_KEY")
      ) {
        return res.status(500).json({ error: "API configuration error" });
      }
      res.status(500).json({ error: "Failed to get memory associations" });
    }
  };
}
