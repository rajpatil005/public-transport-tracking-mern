from langchain_core.tools import tool
from math import radians, sin, cos, sqrt, atan2

from app.tools.helpers import get_buses


def calculate_distance(lat1, lng1, lat2, lng2):
    """
    Calculate distance between two coordinates in KM.
    """

    R = 6371  # Earth radius in KM

    lat1 = radians(lat1)
    lng1 = radians(lng1)
    lat2 = radians(lat2)
    lng2 = radians(lng2)

    dlat = lat2 - lat1
    dlng = lng2 - lng1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(dlng / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c


@tool
async def nearest_buses_tool(
    latitude: float,
    longitude: float,
    limit: int = 5
):
    """
    Find nearest buses from a given latitude and longitude.
    """

    buses = await get_buses()

    nearby_buses = []

    for bus in buses:

        location = bus.get("location")

        if not location:
            continue

        distance = calculate_distance(
            latitude,
            longitude,
            location.get("lat"),
            location.get("lng")
        )

        nearby_buses.append({
            "bus_number": bus.get("busNumber"),
            "route_number": bus.get("route", {}).get("routeNumber"),
            "route": bus.get("route", {}).get("routeName"),
            "distance_km": round(distance, 2)
        })


    nearby_buses.sort(
        key=lambda x: x["distance_km"]
    )

    return nearby_buses[:limit]