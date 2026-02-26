import React, { useEffect, useState } from "react";
import BusTracker from "../maps/BusTracker";
import api from "../../services/api";
import Card from "../ui/Card";
import Input from "../ui/Input";
import { Search, Bus } from "lucide-react";
import { useSocket } from "../../context/SocketProvider";

const TrackBus = () => {
  const { socket } = useSocket();

  const [routesWithActiveBuses, setRoutesWithActiveBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH TRACKING DATA ================= */

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const [routeRes, busRes] = await Promise.all([
          api.get("/api/routes"),
          api.get("/api/buses"),
        ]);

        const routes = routeRes.data.data || [];
        const buses = busRes.data.data || [];

        const activeRoutes = routes
          .map((route) => {
            const activeBuses = buses.filter((bus) => {
              if (!bus.route) return false;

              return bus.route._id.toString() === route._id.toString();
            });

            if (activeBuses.length > 0) {
              return {
                route,
                activeBuses,
              };
            }

            return null;
          })
          .filter(Boolean);

        setRoutesWithActiveBuses(activeRoutes);
      } catch (err) {
        console.error("Tracking Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

  /* ================= ROUTE SELECT ================= */

  const handleRouteSelect = (routeData) => {
    setSelectedRouteId(routeData.route._id);

    const bus = routeData.activeBuses[0];
    setSelectedBus(bus);

    /* ⭐ SOCKET ROOM JOIN (CRITICAL FIX) */
    if (socket && bus?.route?.routeNumber) {
      socket.emit("track-bus", bus.route.routeNumber);
    }
  };

  /* ================= SEARCH FILTER ================= */

  const filteredRoutes = routesWithActiveBuses.filter((item) =>
    item.route.routeName?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-lg">
        Loading Tracking Dashboard...
      </div>
    );
  }

  return (
    <div className="h-[80vh] flex bg-gray-100 rounded-xl overflow-hidden shadow-lg">
      {/* LEFT PANEL */}
      <div className="w-1/3 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center mb-3">
            <Bus className="mr-2 text-blue-600" />
            Live Routes
          </h2>

          <Input
            placeholder="Search active route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>

        <div className="p-3 space-y-3">
          {filteredRoutes.length === 0 && (
            <div className="text-center text-gray-500 mt-6">
              No active routes available
            </div>
          )}

          {filteredRoutes.map((item) => (
            <Card
              key={item.route._id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRouteId === item.route._id
                  ? "border-blue-600 border-2"
                  : ""
              }`}
              onClick={() => handleRouteSelect(item)}
            >
              <Card.Body className="p-4">
                <h3 className="font-semibold text-lg">
                  {item.route.routeNumber} - {item.route.routeName}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {item.route.startPoint} → {item.route.endPoint}
                </p>

                <div className="mt-2 text-sm flex items-center justify-between">
                  <span>
                    Active Buses: <strong>{item.activeBuses.length}</strong>
                  </span>

                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Live
                  </span>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 relative bg-gray-200">
        {!selectedBus && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-lg z-10">
            Select a live route from the left panel to start tracking
          </div>
        )}

        {selectedBus && <BusTracker bus={selectedBus} />}
      </div>
    </div>
  );
};

export default TrackBus;
