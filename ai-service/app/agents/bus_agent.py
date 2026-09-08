import os
from dotenv import load_dotenv

from langchain.agents import create_agent
from langchain_google_genai import ChatGoogleGenerativeAI

from app.tools.bus_tools import get_bus_tool
from app.tools.route_tools import get_route_tool
from app.tools.active_bus_count_tool import active_bus_count_tool
from app.tools.available_buses_tool import available_buses_tool
from app.tools.buses_on_route_tool import buses_on_route_tool
from app.tools.nearest_buses_tool import nearest_buses_tool
from app.tools.search_bus_tool import search_bus_tool

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY is not set in environment variables")

model = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    google_api_key=api_key,
    temperature=0.1,
)

print(f"✅ Using Gemini model: gemini-3.6-flash")

agent = create_agent(
    model=model,
    tools=[
        get_bus_tool,
        get_route_tool,
        active_bus_count_tool,
        available_buses_tool,
        buses_on_route_tool,
        nearest_buses_tool,
        search_bus_tool,
    ],
    system_prompt="""
You are an AI assistant for a public bus tracking system.

Use the available tools whenever the user asks about:
- A specific bus
- A specific route
- Active buses
- Available buses
- Buses running on a route
- Searching buses by driver, route, status or bus number
- Nearest buses

Always use tools instead of guessing.

Never invent bus numbers, routes, locations or statuses.

If no information is available, clearly say so.

Keep your answers concise and helpful.
""",
)