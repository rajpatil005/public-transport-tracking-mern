from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = datetime.now()

class ChatSession(BaseModel):
    session_id: str
    messages: List[ChatMessage] = []
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

class ChatHistory(BaseModel):
    sessions: dict = {}  # session_id -> ChatSession