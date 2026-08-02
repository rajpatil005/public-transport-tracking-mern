import express from "express";
import { chatWithAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/", chatWithAI);

export default router;
