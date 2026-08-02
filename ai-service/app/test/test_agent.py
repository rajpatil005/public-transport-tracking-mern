import asyncio

from app.agents.bus_agent import agent


async def main():

    response = await agent.ainvoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": "Tell me about route 101",
                }
            ]
        }
    )

    last_message = response["messages"][-1]
    print(last_message.content)


asyncio.run(main())