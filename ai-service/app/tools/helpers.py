from app.services.bus_service import getAllBuses


async def get_buses():
    response = await getAllBuses()
    return response.get("data", [])