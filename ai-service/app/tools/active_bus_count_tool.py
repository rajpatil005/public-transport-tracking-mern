from langchain_core.tools import tool
from app.tools.helpers import get_buses

@tool
async def active_bus_count_tool():
    """
    Get the total number of active buses.
    """

    buses = await get_buses()

    active_count = sum(
        1
        for bus in buses
        if bus.get("status", "").upper() == "ACTIVE"
    )

    return {
        "active_buses": active_count
    }