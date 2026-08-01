from fastapi import FastAPI
from app.schemas import ChatRequest, ChatResponse
from app.services.bus_service import getAllBuses
from app.services.formatter import simplifyBusData
from app.services.ai_service import generateAnswer

app = FastAPI()

@app.get("/")
def home() :
    return {
    "message" : "AI is running"
}

@app.post("/api/chat")
async def chat (request : ChatRequest):
    buses = await getAllBuses()

    formatted = simplifyBusData(buses)

    answer = await generateAnswer(
        request.question,
        formatted
    )

    return {
        "answer": answer
    }