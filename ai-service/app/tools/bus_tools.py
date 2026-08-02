from langchain_core.tools import tool
from app.services.bus_service import getAllBuses
from app.services.formatter import simplifySingleBus

@tool
async def get_bus_tool(bus_number: str) :
    '''
        Get Information about a specific bus using its bus number
    '''

    response = await getAllBuses()

    buses = response.get("data", [])

    for bus in buses :
        if bus.get("busNumber") == bus_number:
            return simplifySingleBus(bus)

    return "No matching bus found"