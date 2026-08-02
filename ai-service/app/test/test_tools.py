import asyncio
from app.tools.bus_tools import get_bus_tool
from app.tools.route_tools import get_route_tool


async def main():

    ''' bus tool test '''
    result = await get_bus_tool.ainvoke(
        "MH09-1234"
    )

    ''' route tool test '''
    # result = await get_route_tool.ainvoke(
    #     {
    #         "route_number": "101"
    #     }
    # )

    print(result)


asyncio.run(main())