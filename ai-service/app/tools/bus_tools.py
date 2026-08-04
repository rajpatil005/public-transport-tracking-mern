from langchain_core.tools import tool

from app.tools.helpers import get_buses
from app.services.formatter import simplifySingleBus


@tool
async def get_bus_tool(bus_number: str):
    """
    Get information about a specific bus using its bus number.
    """

    buses = await get_buses()

    for bus in buses:
        if bus.get("busNumber") == bus_number:
            return simplifySingleBus(bus)

    return "No matching bus found."