import { Router } from "express";
// import categoriesRouter from "./categories.routes";
import wordsRouter from "./words.routes";
import aiRoutes from "./ai.routes";

const router = Router();

// router.use("/categories", categoriesRouter);
router.use("/words", wordsRouter);
router.use("/ai", aiRoutes);

export { router };
