from app.agents.bus_agent import agent


async def generateAgentAnswer(question: str):

    try:

        response = await agent.ainvoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": question
                    }
                ]
            }
        )

        final_message = response["messages"][-1]

        if isinstance(final_message.content, list):
            return "".join(
                block["text"]
                for block in final_message.content
                if block["type"] == "text"
            )

        return final_message.content


    except Exception as e:
        print("Agent Error:", e)

        return "Sorry, I am unable to process your request right now."