from langchain_core.prompts import ChatPromptTemplate  # Fixed import

agent_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a bus tracking AI assistant.

Use tools whenever you need bus or route information.

Never invent bus data.

Answer clearly and shortly.
"""
        ),
        (
            "human",
            "{input}"
        ),
        (
            "placeholder",
            "{agent_scratchpad}"
        )
    ]
)