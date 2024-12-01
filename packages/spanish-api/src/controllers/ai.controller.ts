import { Request, Response } from "express";
import { AIService } from "../services/ai.service";
import { BatchExamplesRequest } from "../types/ai.types";

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
}
