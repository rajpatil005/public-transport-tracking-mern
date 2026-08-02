export const chatWithAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "question is required",
      });
    }

    const response = await fetch(`${process.env.AI_SERVICE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error("FastAPI service error");
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      answer: data.answer,
    });
  } catch (error) {
    console.error("AI controller Error : ", error);

    res.status(500).json({
      success: false,
      message: "Failed to get AI response",
    });
  }
};
