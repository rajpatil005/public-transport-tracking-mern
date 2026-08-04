from langchain_core.tools import tool
from app.tools.helpers import get_buses

@tool
async def buses_on_route_tool(route_number: str):
    """
    Get all buses running on a specific route.
    """

    buses = await get_buses()

    route_buses = []

    for bus in buses:

        route = bus.get("route", {})

        if route.get("routeNumber") == route_number:

            route_buses.append({
                "bus_number": bus.get("busNumber"),
                "driver": bus.get("driverName"),
                "status": bus.get("status"),
                "capacity": bus.get("capacity"),
            })

    if not route_buses:
        return "No buses found for this route."

    return route_buses