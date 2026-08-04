from langchain_core.tools import tool
from app.tools.helpers import get_buses

@tool
async def available_buses_tool():
    """
    Get all currently active buses.
    """

    buses = await get_buses()

    available_buses = []

    for bus in buses:

        if bus.get("status", "").upper() == "ACTIVE":

            available_buses.append({
                "bus_number": bus.get("busNumber"),
                "route_number": bus.get("route", {}).get("routeNumber"),
                "route": bus.get("route", {}).get("routeName"),
                "driver": bus.get("driverName"),
            })

    return available_buses