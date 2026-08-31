import fetch from 'node-fetch';

export const chatWithAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "question is required",
      });
    }

    console.log(`📩 Received question: ${question}`);
    console.log(`🔗 AI Service URL: ${process.env.AI_SERVICE_URL}/api/chat`);

    // Check if AI_SERVICE_URL is set
    if (!process.env.AI_SERVICE_URL) {
      console.error("❌ AI_SERVICE_URL is not configured");
      return res.status(500).json({
        success: false,
        message: "AI Service URL is not configured. Please set AI_SERVICE_URL in .env",
      });
    }

    try {
      // Call FastAPI service
      const response = await fetch(`${process.env.AI_SERVICE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          question: question,
          session_id: `session_${Date.now()}`
        }),
      });

      console.log(`📊 FastAPI Response Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ FastAPI Error (${response.status}):`, errorText);
        return res.status(response.status).json({
          success: false,
          message: `FastAPI error: ${response.status}`,
          details: errorText
        });
      }

      const data = await response.json();
      console.log("✅ FastAPI Response:", data);

      return res.status(200).json({
        success: true,
        answer: data.answer || "I processed your request but didn't get a response.",
      });

    } catch (fetchError) {
      console.error("❌ Fetch Error:", fetchError.message);
      
      if (fetchError.code === 'ECONNREFUSED' || fetchError.message.includes('connect')) {
        return res.status(503).json({
          success: false,
          message: "AI Service is not running. Please start the FastAPI server on port 8000.",
        });
      }
      
      return res.status(500).json({
        success: false,
        message: fetchError.message || "Failed to connect to AI service",
      });
    }

  } catch (error) {
    console.error("❌ AI controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get AI response",
    });
  }
};