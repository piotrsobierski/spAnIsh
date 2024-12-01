import { Request, Response } from "express";
import { AIService } from "../services/ai.service";
import { BatchExamplesRequest, WordRequest } from "../types/ai.types";

export class AIController {
  constructor(private aiService: AIService) {}

  generateExampleSentences = async (
    req: Request<{}, {}, BatchExamplesRequest>,
    res: Response
  ) => {
    try {
      const { words, targetLang = "Spanish", sentencesPerWord = 3 } = req.body;

      if (!Array.isArray(words) || words.length === 0) {
        return res.status(400).json({ error: "Words array is required" });
      }

      const result = await this.aiService.generateExamples(
        words,
        targetLang,
        sentencesPerWord
      );

      return res.json(result);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        error: "Failed to generate examples",
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
      const { word, targetLang = "Spanish" } = req.body;

      if (!word) {
        return res.status(400).json({ error: "Word is required" });
      }

      const result = await this.aiService.generateRelatedWords(
        word,
        targetLang
      );
      return res.json(result);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        error: "Failed to generate related words",
        details: error instanceof Error ? error.message : undefined,
      });
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
      const { word, targetLang = "Spanish" } = req.body;

      if (!word) {
        return res.status(400).json({ error: "Word is required" });
      }

      const result = await this.aiService.generateMemoryAssociations(
        word,
        targetLang
      );
      return res.json(result);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        error: "Failed to generate memory associations",
        details: error instanceof Error ? error.message : undefined,
      });
    }
  };
}
