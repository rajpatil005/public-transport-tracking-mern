import os
from dotenv import load_dotenv

from langchain.agents import create_agent
from langchain_google_genai import ChatGoogleGenerativeAI

from app.tools.bus_tools import get_bus_tool
from app.tools.route_tools import get_route_tool

load_dotenv()

model = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0,
)

agent = create_agent(
    model=model,
    tools=[
        get_bus_tool,
        get_route_tool,
    ],
    system_prompt="""
You are a bus tracking AI assistant.

Use the available tools whenever bus or route information is required.

Never invent bus numbers, routes or statuses.
If no information is found, clearly say so.
""",
)