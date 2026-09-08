from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ChatRequest, ChatResponse, ChatHistoryResponse
from app.services.bus_service import getAllBuses
from app.services.formatter import simplifyBusData
from app.services.agent_service import generateAgentAnswer
from app.services.chat_history_service import chat_history_service

app = FastAPI()

# Add CORS middleware if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "AI is running"
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    result = await generateAgentAnswer(
        request.question,
        request.session_id
    )
    
    return ChatResponse(
        answer=result["answer"],
        session_id=result["session_id"]
    )

@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a specific session"""
    messages = chat_history_service.get_session_history(session_id)
    return ChatHistoryResponse(
        session_id=session_id,
        messages=messages
    )

@app.delete("/api/chat/history/{session_id}")
async def clear_chat_history(session_id: str):
    """Clear chat history for a specific session"""
    chat_history_service.clear_session(session_id)
    return {"message": "Chat history cleared"}

@app.get("/api/chat/sessions")
async def get_all_sessions():
    """Get all chat sessions"""
    sessions = []
    for session_id, session in chat_history_service.sessions.items():
        sessions.append({
            "session_id": session_id,
            "message_count": len(session.messages),
            "created_at": session.created_at,
            "updated_at": session.updated_at
        })
    return {"sessions": sessions}