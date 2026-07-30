from fastapi import FastAPI
from app.schemas import ChatRequest, ChatResponse
from app.services.bus_service import getAllBuses
from app.services.formatter import simplifyBusData

app = FastAPI()

@app.get("/")
def home() :
    return {
    "message" : "AI is running"
}

@app.post("/")
async def chat (request : ChatRequest):
    buses = await getAllBuses()

    formatted = simplifyBusData(buses)

    return {
        "question" : request.question,
        "buses" : formatted
    }