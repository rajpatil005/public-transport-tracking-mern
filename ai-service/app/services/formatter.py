def simplifyBusData(bus_response):
    buses = bus_response.get("data", [])

    simplified = []

    for bus in buses :
        simplified.append({
            "bus_number" : bus.get("busNumber"),
            "driver" : bus.get("driverName"),
            "status" : bus.get("status"),
            "capacity" : bus.get("capacity"),
            "route" : bus.get("route", {}).get("routeName"),
        })

    return simplified