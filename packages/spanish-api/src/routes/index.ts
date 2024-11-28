import { Router } from "express";
// import categoriesRouter from "./categories.routes";
import wordsRouter from "./words.routes";

const router = Router();

// router.use("/categories", categoriesRouter);
router.use("/words", wordsRouter);

export { router };
