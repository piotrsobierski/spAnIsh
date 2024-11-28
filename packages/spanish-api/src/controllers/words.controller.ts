import { Request, Response } from "express";
import AppDataSource from "../config/database";
import { Word } from "../entities/Word";
import { Between, IsNull, LessThan } from "typeorm";

export class WordsController {
  private wordRepository = AppDataSource.getRepository(Word);

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
  async getWords(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const words = await this.wordRepository.find({
        take: limit,
        relations: ["category"],
      });
      res.json(words);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch words" });
    }
  }

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
  async getNotLearnedWords(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const words = await this.wordRepository.find({
        where: [
          { lastAnswerTime: IsNull() }, // Never answered
          { goodAnswers: LessThan(3) }, // Less than 3 correct answers
          {
            lastAnswerTime: LessThan(
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ), // Not answered in last 7 days
          },
        ],
        take: limit,
        relations: ["category"],
      });
      res.json(words);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch words" });
    }
  }

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
  async saveAnswer(req: Request, res: Response) {
    try {
      const { wordId, isCorrect } = req.body;

      const word = await this.wordRepository.findOne({
        where: { id: wordId },
      });

      if (!word) {
        return res.status(404).json({ error: "Word not found" });
      }

      // Update answer counts
      if (isCorrect) {
        word.goodAnswers += 1;
      } else {
        word.badAnswers += 1;
      }

      word.lastAnswerTime = new Date();

      await this.wordRepository.save(word);
      res.json(word);
    } catch (error) {
      res.status(500).json({ error: "Failed to save answer" });
    }
  }

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
  async getWordStats(req: Request, res: Response) {
    try {
      const { wordId } = req.params;
      const word = await this.wordRepository.findOne({
        where: { id: parseInt(wordId) },
        select: [
          "id",
          "word",
          "translation",
          "goodAnswers",
          "badAnswers",
          "lastAnswerTime",
        ],
      });

      if (!word) {
        return res.status(404).json({ error: "Word not found" });
      }

      const totalAnswers = word.goodAnswers + word.badAnswers;
      const successRate =
        totalAnswers > 0 ? (word.goodAnswers / totalAnswers) * 100 : 0;

      res.json({
        ...word,
        totalAnswers,
        successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch word stats" });
    }
  }
}
