import uuid
from app.agents.bus_agent import agent
from app.services.chat_history_service import chat_history_service
from langchain_core.messages import HumanMessage, AIMessage

async def generateAgentAnswer(question: str, session_id: str = None):
    try:
        # Generate session_id if not provided
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Get chat history for context
        session = chat_history_service.get_or_create_session(session_id)
        
        # Build messages with history
        messages = []
        
        # Add last 5 messages for context (to avoid token limits)
        for msg in session.messages[-5:]:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            else:
                messages.append(AIMessage(content=msg.content))
        
        # Add current question
        messages.append(HumanMessage(content=question))
        
        # Get agent response
        response = await agent.ainvoke(
            {
                "messages": messages
            }
        )
        
        final_message = response["messages"][-1]
        
        if isinstance(final_message.content, list):
            answer = "".join(
                block["text"]
                for block in final_message.content
                if block["type"] == "text"
            )
        else:
            answer = final_message.content
        
        # Save to chat history
        chat_history_service.add_message(session_id, "user", question)
        chat_history_service.add_message(session_id, "assistant", answer)
        
        return {
            "answer": answer,
            "session_id": session_id
        }

    except Exception as e:
        print("Agent Error:", e)
        return {
            "answer": "Sorry, I am unable to process your request right now.",
            "session_id": session_id if session_id else str(uuid.uuid4())
        }