import { Router } from "express";
import AppDataSource from "../config/database";
import { Word } from "../entities/Word";
import { WordsService } from "../services/words.service";
import { WordsController } from "../controllers/words.controller";
import { AIService } from "../services/ai.service";

const router = Router();
const wordRepository = AppDataSource.getRepository(Word);
const aiService = new AIService();
const wordsService = new WordsService(wordRepository, aiService);
const wordsController = new WordsController(wordsService);

// Get words with optional limit
router.get("/", wordsController.getWords);

// Get not learned words
router.get("/not-learned", wordsController.getNotLearnedWords);

// Add the new learning stats route (add this before other routes)
router.get("/learning-stats", wordsController.getLearningStats);

// Save answer for a word
router.post("/answer", wordsController.saveAnswer);

// Get word statistics
router.get("/:wordId/stats", wordsController.getWordStats);

// Add this route
router.post("/:wordId/skip", wordsController.skipWord);

// Add this route
router.get(
  "/not-learned-with-examples",
  wordsController.getNotLearnedWordsWithExamples
);

// Add this route with the other routes
router.get(
  "/random-not-learned-with-examples",
  wordsController.getRandomNotLearnedWordsWithExamples
);

export default router;
