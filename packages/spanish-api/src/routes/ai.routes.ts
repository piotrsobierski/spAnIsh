import { Router } from "express";
import { AIService } from "../services/ai.service";
import { AIController } from "../controllers/ai.controller";

const router = Router();
const aiService = new AIService();
const aiController = new AIController(aiService);

router.post("/generate-examples", aiController.generateExampleSentences);
router.post("/generate-related-words", aiController.generateRelatedWords);
router.post(
  "/generate-memory-associations",
  aiController.generateMemoryAssociations
);

export default router;
