import { Router } from "express";
import { WordsController } from "../controllers/words.controller";

const router = Router();
const wordsController = new WordsController();

// Get words with optional limit
router.get("/", (req, res) => wordsController.getWords(req, res));

// Get not learned words
router.get("/not-learned", (req, res) =>
  wordsController.getNotLearnedWords(req, res)
);

// Save answer for a word
router.post("/answer", (req, res) => wordsController.saveAnswer(req, res));

// Get word statistics
router.get("/:wordId/stats", (req, res) =>
  wordsController.getWordStats(req, res)
);

export default router;
