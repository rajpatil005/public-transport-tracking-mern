import asyncio

from app.agents.bus_agent import agent


async def main():

    response = await agent.ainvoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": "Find nearest buses from latitude 16.7017 longitude 74.2431",
                }
            ]
        }
    )

    last_message = response["messages"][-1]

    print(type(last_message))
    print(last_message)


asyncio.run(main())