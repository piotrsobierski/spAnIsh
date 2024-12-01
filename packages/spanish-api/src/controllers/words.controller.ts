import { Request, Response } from "express";
import { WordsService } from "../services/words.service";

export class WordsController {
  constructor(private wordsService: WordsService) {}

  /**
   * @swagger
   * /words:
   *   get:
   *     responses:
   *       200:
   *         description: List of words
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Word'
   */
  getWords = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const words = await this.wordsService.findAll(limit);
      res.json(words);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch words" });
    }
  };

  /**
   * @swagger
   * /words/not-learned:
   *   get:
   *     summary: Get not learned words
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of words to return
   *     responses:
   *       200:
   *         description: List of not learned words
   */
  getNotLearnedWords = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const words = await this.wordsService.findNotLearned(limit);
      res.json(words);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch words" });
    }
  };

  /**
   * @swagger
   * /words/not-learned-with-examples:
   *   get:
   *     summary: Get not learned words with example sentences
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of words to return
   *     responses:
   *       200:
   *         description: List of not learned words with examples
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 allOf:
   *                   - $ref: '#/components/schemas/Word'
   *                   - type: object
   *                     properties:
   *                       example:
   *                         type: object
   *                         properties:
   *                           original:
   *                             type: string
   *                           english:
   *                             type: string
   */
  getNotLearnedWordsWithExamples = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const words = await this.wordsService.findNotLearnedWithExamples(limit);
      res.json(words);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: "Failed to fetch words with examples",
        details: error instanceof Error ? error.message : undefined,
      });
    }
  };

  /**
   * @swagger
   * /words/answer:
   *   post:
   *     summary: Save answer for a word
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               wordId:
   *                 type: integer
   *               isCorrect:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Answer saved successfully
   */
  saveAnswer = async (req: Request, res: Response) => {
    try {
      const { wordId, isCorrect } = req.body;
      const word = await this.wordsService.saveAnswer(wordId, isCorrect);
      res.json(word);
    } catch (error) {
      if (error instanceof Error && error.message === "Word not found") {
        return res.status(404).json({ error: "Word not found" });
      }
      res.status(500).json({ error: "Failed to save answer" });
    }
  };

  /**
   * @swagger
   * /words/{wordId}/stats:
   *   get:
   *     summary: Get statistics for a word
   *     parameters:
   *       - in: path
   *         name: wordId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the word
   *     responses:
   *       200:
   *         description: Word statistics
   *       404:
   *         description: Word not found
   */
  getWordStats = async (req: Request, res: Response) => {
    try {
      const { wordId } = req.params;
      const stats = await this.wordsService.getStats(parseInt(wordId));
      res.json(stats);
    } catch (error) {
      if (error instanceof Error && error.message === "Word not found") {
        return res.status(404).json({ error: "Word not found" });
      }
      res.status(500).json({ error: "Failed to fetch word stats" });
    }
  };

  /**
   * @swagger
   * /words/{wordId}/skip:
   *   post:
   *     summary: Skip a word
   *     parameters:
   *       - in: path
   *         name: wordId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the word to skip
   *     responses:
   *       200:
   *         description: Word skipped successfully
   *       404:
   *         description: Word not found
   */
  skipWord = async (req: Request, res: Response) => {
    try {
      const { wordId } = req.params;
      const word = await this.wordsService.skipWord(parseInt(wordId));
      res.json(word);
    } catch (error) {
      if (error instanceof Error && error.message === "Word not found") {
        return res.status(404).json({ error: "Word not found" });
      }
      res.status(500).json({ error: "Failed to skip word" });
    }
  };
}
