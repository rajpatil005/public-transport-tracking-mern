from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = None  

class ChatResponse(BaseModel):
    answer: str
    session_id: str

class ChatMessageResponse(BaseModel):
    role: str
    content: str
    timestamp: datetime

class ChatHistoryResponse(BaseModel):
    session_id: str
    messages: List[ChatMessageResponse]