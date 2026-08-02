from langchain_core.tools import tool
from app.services.bus_service import getAllBuses
from app.services.formatter import simplifySingleRoute

@tool
async def get_route_tool(route_number: str):
    '''
        Get information about a specific route using its route number
    '''

    response = await getAllBuses()

    buses = response.get("data", [])

    for bus in buses:

        route = bus.get("route", {})

        if route.get("routeNumber") == route_number:

            return simplifySingleRoute(route, bus)

    return "No matching route found"