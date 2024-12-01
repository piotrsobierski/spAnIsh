import { Router } from "express";
import AppDataSource from "../config/database";
import { Word } from "../entities/Word";
import { WordsService } from "../services/words.service";
import { WordsController } from "../controllers/words.controller";

const router = Router();
const wordRepository = AppDataSource.getRepository(Word);
const wordsService = new WordsService(wordRepository);
const wordsController = new WordsController(wordsService);

// Get words with optional limit
router.get("/", wordsController.getWords);

// Get not learned words
router.get("/not-learned", wordsController.getNotLearnedWords);

// Save answer for a word
router.post("/answer", wordsController.saveAnswer);

// Get word statistics
router.get("/:wordId/stats", wordsController.getWordStats);

export default router;
