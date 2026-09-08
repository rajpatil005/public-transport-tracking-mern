import express from "express";
import { 
  chatWithAI, 
  getChatHistory, 
  clearChatHistory, 
  getAllSessions 
} from "../controllers/aiController.js";

const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`📥 AI Route: ${req.method} ${req.originalUrl}`);
  next();
});

// Chat endpoints - Note: These are mounted at /api/chat in main server
// So the full path will be /api/chat for POST
router.post("/", chatWithAI);  // This handles POST /api/chat
router.get("/history/:sessionId", getChatHistory);  // GET /api/chat/history/:sessionId
router.delete("/history/:sessionId", clearChatHistory);  // DELETE /api/chat/history/:sessionId
router.get("/sessions", getAllSessions);  // GET /api/chat/sessions

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "AI routes are working!",
    endpoints: {
      chat: "POST /api/chat",
      history: "GET /api/chat/history/:sessionId",
      clear: "DELETE /api/chat/history/:sessionId",
      sessions: "GET /api/chat/sessions"
    }
  });
});

export default router;