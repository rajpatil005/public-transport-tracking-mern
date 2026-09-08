import json
import os
from datetime import datetime
from typing import Optional, List
from app.models.chat_history import ChatSession, ChatMessage

CHAT_HISTORY_FILE = "chat_history.json"

class ChatHistoryService:
    def __init__(self):
        self.sessions = {}
        self._load_history()
    
    def _load_history(self):
        """Load chat history from file"""
        if os.path.exists(CHAT_HISTORY_FILE):
            try:
                with open(CHAT_HISTORY_FILE, 'r') as f:
                    data = json.load(f)
                    for session_id, session_data in data.get("sessions", {}).items():
                        session = ChatSession(
                            session_id=session_id,
                            created_at=datetime.fromisoformat(session_data["created_at"]),
                            updated_at=datetime.fromisoformat(session_data["updated_at"])
                        )
                        for msg in session_data.get("messages", []):
                            session.messages.append(
                                ChatMessage(
                                    role=msg["role"],
                                    content=msg["content"],
                                    timestamp=datetime.fromisoformat(msg["timestamp"])
                                )
                            )
                        self.sessions[session_id] = session
            except Exception as e:
                print(f"Error loading chat history: {e}")
    
    def _save_history(self):
        """Save chat history to file"""
        try:
            data = {
                "sessions": {}
            }
            for session_id, session in self.sessions.items():
                data["sessions"][session_id] = {
                    "created_at": session.created_at.isoformat(),
                    "updated_at": session.updated_at.isoformat(),
                    "messages": [
                        {
                            "role": msg.role,
                            "content": msg.content,
                            "timestamp": msg.timestamp.isoformat()
                        }
                        for msg in session.messages
                    ]
                }
            with open(CHAT_HISTORY_FILE, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving chat history: {e}")
    
    def get_or_create_session(self, session_id: str) -> ChatSession:
        """Get existing session or create new one"""
        if session_id not in self.sessions:
            self.sessions[session_id] = ChatSession(session_id=session_id)
            self._save_history()
        return self.sessions[session_id]
    
    def add_message(self, session_id: str, role: str, content: str):
        """Add a message to the session"""
        session = self.get_or_create_session(session_id)
        session.messages.append(
            ChatMessage(role=role, content=content)
        )
        session.updated_at = datetime.now()
        self._save_history()
    
    def get_session_history(self, session_id: str) -> List[ChatMessage]:
        """Get all messages for a session"""
        session = self.get_or_create_session(session_id)
        return session.messages
    
    def clear_session(self, session_id: str):
        """Clear all messages from a session"""
        if session_id in self.sessions:
            self.sessions[session_id].messages = []
            self.sessions[session_id].updated_at = datetime.now()
            self._save_history()
    
    def delete_session(self, session_id: str):
        """Delete a session entirely"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            self._save_history()

# Singleton instance
chat_history_service = ChatHistoryService()