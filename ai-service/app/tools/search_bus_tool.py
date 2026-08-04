from langchain_core.tools import tool
from app.tools.helpers import get_buses

@tool
async def search_bus_tool(query: str):
    """
    Search buses using bus number, driver name,
    route name, or status.
    """

    buses = await get_buses()

    query = query.lower()

    results = []

    for bus in buses:

        bus_number = str(
            bus.get("busNumber", "")
        ).lower()

        driver = str(
            bus.get("driverName", "")
        ).lower()

        status = str(
            bus.get("status", "")
        ).lower()

        route = bus.get("route", {})

        route_name = str(
            route.get("routeName", "")
        ).lower()

        route_number = str(
            route.get("routeNumber", "")
        ).lower()


        if (
            query in bus_number
            or query in driver
            or query in status
            or query in route_name
            or query in route_number
        ):

            results.append({

                "bus_number": bus.get("busNumber"),

                "driver": bus.get("driverName"),

                "status": bus.get("status"),

                "route_number": route.get("routeNumber"),

                "route": route.get("routeName")

            })


    if not results:
        return "No matching buses found."


    return results