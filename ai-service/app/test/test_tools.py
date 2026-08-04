import asyncio
from app.tools.bus_tools import get_bus_tool
from app.tools.route_tools import get_route_tool
from app.tools.active_bus_count_tool import active_bus_count_tool
from app.tools.available_buses_tool import available_buses_tool
from app.tools.buses_on_route_tool import buses_on_route_tool
from app.tools.search_bus_tool import search_bus_tool
from app.tools.nearest_buses_tool import nearest_buses_tool


async def main():

    ''' bus tool test '''
    # result = await get_bus_tool.ainvoke(
    #     "MH09-1234"
    # )

    ''' route tool test '''
    # result = await get_route_tool.ainvoke(
    #     {
    #         "route_number": "101"
    #     }
    # )

    ''' active buses count tool test '''
    # result = await active_bus_count_tool.ainvoke({})

    ''' available buses tool test '''
    # result = await available_buses_tool.ainvoke({})

    ''' buses on route tool test '''
    # result = await buses_on_route_tool.ainvoke(
    #     {
    #         "route_number": "101"
    #     }
    # )

    ''' search bus tool test '''
    # result = await search_bus_tool.ainvoke(
    #     {
    #         "query": "Rankala"
    #     }
    # )

    ''' nearest buses tool test '''
    result = await nearest_buses_tool.ainvoke(
        {
            "latitude": 16.7017,
            "longitude": 74.2431,
            "limit": 3
        }
    )

    print(result)


asyncio.run(main())