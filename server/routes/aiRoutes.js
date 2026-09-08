import express from "express";
import { 
  chatWithAI, 
  getChatHistory, 
  clearChatHistory, 
  getAllSessions 
} from "../controllers/aiController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`📥 AI Route: ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/", chatWithAI);
router.get("/history/:sessionId", getChatHistory);
router.delete("/history/:sessionId", clearChatHistory);
router.get("/sessions", getAllSessions);

router.get("/test", async (req, res) => {
  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const response = await fetch(`${aiServiceUrl}/health`);
    const data = await response.json();
    res.json({
      success: true,
      ai_service: data,
      ai_service_url: aiServiceUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      ai_service_url: process.env.AI_SERVICE_URL || 'http://localhost:8000'
    });
  }
});

export default router;