import { Router } from "express";
import { AIController } from "../controllers/ai.controller";

const router = Router();
const aiController = new AIController();

router.post("/generate-examples", aiController.generateExampleSentences);
router.post("/generate-related-words", aiController.generateRelatedWords);
router.post(
  "/generate-memory-associations",
  aiController.generateMemoryAssociations
);

export default router;
