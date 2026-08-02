def simplifyBusData(bus_response):
    buses = bus_response.get("data", [])

    simplified = []

    for bus in buses :
        simplified.append({
            "bus_number": bus.get("busNumber"),  
            "driver" : bus.get("driverName"),
            "status" : bus.get("status"),
            "capacity" : bus.get("capacity"),
            "route_number": bus.get("route", {}).get("routeNumber"),
            "route" : bus.get("route", {}).get("routeName", "routeNumber"),
        })

    return simplified

def simplifySingleBus(bus):

    return {
        "bus_number": bus.get("busNumber"),
        "driver": bus.get("driverName"),
        "status": bus.get("status"),
        "capacity": bus.get("capacity"),
        "route_number": bus.get("route", {}).get("routeNumber"),
        "route": bus.get("route", {}).get("routeName"),
        "location": bus.get("location")
    }

def simplifySingleRoute(route, bus):

    return {
        "route_number": route.get("routeNumber"),
        "route_name": route.get("routeName"),
        "bus_number": bus.get("busNumber"),
        "status": bus.get("status")
    }