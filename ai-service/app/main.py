from fastapi import FastAPI
from app.schemas import ChatRequest, ChatResponse
from app.services.bus_service import getAllBuses
from app.services.formatter import simplifyBusData
from app.services.agent_service import generateAgentAnswer
app = FastAPI()

@app.get("/")
def home() :
    return {
    "message" : "AI is running"
}

@app.post("/api/chat")
async def chat (request : ChatRequest):
    answer = await generateAgentAnswer(
        request.question
    )

    return {
        "answer": answer
    }