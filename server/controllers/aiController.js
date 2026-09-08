import fetch from 'node-fetch';

// Store chat sessions in memory
const chatSessions = new Map();

// Get or create session
const getSession = (sessionId) => {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!chatSessions.has(sessionId)) {
    chatSessions.set(sessionId, {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: []
    });
    console.log(`🆕 Created new session: ${sessionId}`);
  }
  
  return { sessionId, session: chatSessions.get(sessionId) };
};

export const chatWithAI = async (req, res) => {
  try {
    console.log('📩 Chat request received:', req.body);
    const { question, session_id } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "question is required",
      });
    }

    // Get or create session
    const { sessionId, session } = getSession(session_id);

    // Check if AI_SERVICE_URL is set
    if (!process.env.AI_SERVICE_URL) {
      console.error("❌ AI_SERVICE_URL is not configured");
      
      // Add error message to session
      const errorMessage = {
        role: "assistant",
        content: "⚠️ AI Service is not configured. Please set AI_SERVICE_URL in .env file.",
        timestamp: new Date().toISOString()
      };
      session.messages.push(errorMessage);
      
      return res.status(200).json({
        success: false,
        answer: errorMessage.content,
        session_id: sessionId,
        error: "AI_SERVICE_URL not configured"
      });
    }

    // Add user message to session
    const userMessage = {
      role: "user",
      content: question,
      timestamp: new Date().toISOString()
    };
    session.messages.push(userMessage);
    session.updated_at = new Date().toISOString();

    try {
      // Call FastAPI service
      console.log(`🔗 Calling FastAPI: ${process.env.AI_SERVICE_URL}/api/chat`);
      const response = await fetch(`${process.env.AI_SERVICE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          question: question,
          session_id: sessionId
        }),
      });

      console.log(`📊 FastAPI Response Status: ${response.status}`);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("❌ Failed to parse FastAPI response:", parseError);
        data = { answer: "I received an invalid response from the AI service." };
      }

      if (!response.ok) {
        console.error(`❌ FastAPI Error (${response.status}):`, data);
        
        const errorMessage = {
          role: "assistant",
          content: `⚠️ AI Service error: ${data.detail || data.message || response.statusText || 'Unknown error'}`,
          timestamp: new Date().toISOString()
        };
        session.messages.push(errorMessage);
        
        return res.status(200).json({
          success: false,
          answer: errorMessage.content,
          session_id: sessionId,
          error: `FastAPI error: ${response.status}`
        });
      }

      console.log("✅ FastAPI Response received");

      // Add assistant response to session
      const assistantMessage = {
        role: "assistant",
        content: data.answer || "I processed your request but didn't get a response.",
        timestamp: new Date().toISOString()
      };
      session.messages.push(assistantMessage);
      session.updated_at = new Date().toISOString();

      return res.status(200).json({
        success: true,
        answer: data.answer || "I processed your request but didn't get a response.",
        session_id: sessionId
      });

    } catch (fetchError) {
      console.error("❌ Fetch Error:", fetchError.message);
      
      const errorMessage = {
        role: "assistant",
        content: `🔴 Cannot connect to AI service. Please make sure FastAPI is running on port 8000.\n\nError: ${fetchError.message}`,
        timestamp: new Date().toISOString()
      };
      session.messages.push(errorMessage);
      
      return res.status(200).json({
        success: false,
        answer: errorMessage.content,
        session_id: sessionId,
        error: fetchError.message
      });
    }

  } catch (error) {
    console.error("❌ AI controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get AI response"
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log(`📥 Getting history for session: ${sessionId}`);
    
    if (!sessionId || !chatSessions.has(sessionId)) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    const session = chatSessions.get(sessionId);
    return res.status(200).json({
      success: true,
      session_id: sessionId,
      messages: session.messages,
      created_at: session.created_at,
      updated_at: session.updated_at
    });

  } catch (error) {
    console.error("❌ Error getting chat history:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get chat history"
    });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log(`🗑️ Clearing history for session: ${sessionId}`);
    
    if (!sessionId || !chatSessions.has(sessionId)) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    const session = chatSessions.get(sessionId);
    session.messages = [];
    session.updated_at = new Date().toISOString();
    
    return res.status(200).json({
      success: true,
      message: "Chat history cleared",
      session_id: sessionId
    });

  } catch (error) {
    console.error("❌ Error clearing chat history:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clear chat history"
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = [];
    for (const [sessionId, session] of chatSessions) {
      sessions.push({
        session_id: sessionId,
        message_count: session.messages.length,
        created_at: session.created_at,
        updated_at: session.updated_at
      });
    }
    
    return res.status(200).json({
      success: true,
      sessions: sessions,
      total: sessions.length
    });

  } catch (error) {
    console.error("❌ Error getting sessions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get sessions"
    });
  }
};