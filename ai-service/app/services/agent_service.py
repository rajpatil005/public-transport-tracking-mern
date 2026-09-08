import uuid
from app.agents.bus_agent import agent
from app.services.chat_history_service import chat_history_service
from langchain_core.messages import HumanMessage, AIMessage
import asyncio

async def generateAgentAnswer(question: str, session_id: str = None):
    try:
        if not session_id:
            session_id = str(uuid.uuid4())
        
        if agent is None:
            return {
                "answer": "⚠️ AI service is not properly configured.",
                "session_id": session_id
            }
        
        session = chat_history_service.get_or_create_session(session_id)
        
        messages = []
        
        for msg in session.messages[-3:]:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            else:
                messages.append(AIMessage(content=msg.content))
        
        messages.append(HumanMessage(content=question))
        
        try:
            response = await asyncio.wait_for(
                agent.ainvoke({"messages": messages}),
                timeout=15.0
            )
        except asyncio.TimeoutError:
            print("⏰ Agent timeout after 15 seconds")
            return {
                "answer": "⏰ I'm taking too long to respond. Please try a simpler question.",
                "session_id": session_id
            }
        
        final_message = response["messages"][-1]
        
        if isinstance(final_message.content, list):
            answer = "".join(
                block["text"]
                for block in final_message.content
                if block["type"] == "text"
            )
        else:
            answer = final_message.content
        
        chat_history_service.add_message(session_id, "user", question)
        chat_history_service.add_message(session_id, "assistant", answer)
        
        return {
            "answer": answer,
            "session_id": session_id
        }

    except Exception as e:
        print("Agent Error:", e)
        if session_id:
            chat_history_service.add_message(session_id, "user", question)
        return {
            "answer": "Sorry, I am unable to process your request right now. Please try again later.",
            "session_id": session_id if session_id else str(uuid.uuid4())
        }