from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ChatRequest, ChatResponse, ChatHistoryResponse
from app.services.bus_service import getAllBuses
from app.services.formatter import simplifyBusData
from app.services.agent_service import generateAgentAnswer
from app.services.chat_history_service import chat_history_service
import os
import json

app = FastAPI(title="Kolhapur Bus AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5000",
        "https://kolhapur-bus-backend.onrender.com",
        "*"  
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"🚀 Starting Kolhapur Bus AI Service v1.0.0")
print(f"🌍 Environment: {os.getenv('ENVIRONMENT', 'development')}")
print(f"🔗 Backend URL: {os.getenv('BACKEND_URL', 'http://localhost:5000')}")

@app.get("/")
def home():
    return {
        "message": "Kolhapur Bus AI Service is running",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "history": "/api/chat/history/{session_id}",
            "sessions": "/api/chat/sessions",
            "health": "/health"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Kolhapur Bus AI Service",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "sessions_count": len(chat_history_service.sessions),
        "backend_url": os.getenv("BACKEND_URL", "http://localhost:5000")
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        print(f"📩 Processing question: {request.question[:50]}...")
        result = await generateAgentAnswer(
            request.question,
            request.session_id
        )
        
        return ChatResponse(
            answer=result["answer"],
            session_id=result["session_id"]
        )
    except Exception as e:
        print(f"❌ Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a specific session"""
    try:
        messages = chat_history_service.get_session_history(session_id)
        return ChatHistoryResponse(
            session_id=session_id,
            messages=messages
        )
    except Exception as e:
        print(f"❌ Error getting chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/chat/history/{session_id}")
async def clear_chat_history(session_id: str):
    """Clear chat history for a specific session"""
    try:
        chat_history_service.clear_session(session_id)
        return {"message": "Chat history cleared", "session_id": session_id}
    except Exception as e:
        print(f"❌ Error clearing chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/sessions")
async def get_all_sessions():
    """Get all chat sessions"""
    try:
        sessions = []
        for session_id, session in chat_history_service.sessions.items():
            sessions.append({
                "session_id": session_id,
                "message_count": len(session.messages),
                "created_at": session.created_at.isoformat(),
                "updated_at": session.updated_at.isoformat()
            })
        return {"sessions": sessions, "total": len(sessions)}
    except Exception as e:
        print(f"❌ Error getting sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)