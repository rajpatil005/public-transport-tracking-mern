import React, { useEffect, useState } from "react";
import BusTracker from "../maps/BusTracker";
import api from "../../services/api";
import Card from "../ui/Card";
import Input from "../ui/Input";
import { Search, Bus, ChevronLeft, MapPin, Navigation } from "lucide-react";
import { useSocket } from "../../context/SocketProvider";

const TrackBus = () => {
  const { socket } = useSocket();

  const [routesWithActiveBuses, setRoutesWithActiveBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMobilePanel, setShowMobilePanel] = useState(true);

  /* ================= FETCH TRACKING DATA ================= */

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const [routeRes, busRes] = await Promise.all([
          api.get("/routes"),
          api.get("/buses"),
        ]);

        const routes = routeRes.data.data || [];
        const buses = busRes.data.data || [];

        const activeRoutes = routes
          .map((route) => {
            const activeBuses = buses.filter((bus) => {
              if (!bus.route) return false;
              return bus.route._id === route._id;
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
    
    // Hide panel on mobile when route is selected
    if (window.innerWidth < 1024) {
      setShowMobilePanel(false);
    }

    /* ⭐ SOCKET ROOM JOIN (CRITICAL FIX) */
    if (socket && bus?.route?.routeNumber) {
      socket.emit("track-bus", bus.route.routeNumber);
    }
  };

  /* ================= BACK TO ROUTES LIST ================= */
  
  const handleBackToRoutes = () => {
    setShowMobilePanel(true);
    setSelectedBus(null);
    setSelectedRouteId(null);
  };

  /* ================= SEARCH FILTER ================= */

  const filteredRoutes = routesWithActiveBuses.filter((item) =>
    item.route.routeName?.toLowerCase().includes(search.toLowerCase()) ||
    item.route.routeNumber?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-base sm:text-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading Tracking Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] sm:h-[80vh] flex flex-col lg:flex-row bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
      {/* LEFT PANEL - Routes List */}
      <div className={`
        ${showMobilePanel ? 'flex' : 'hidden'} 
        lg:flex lg:w-1/3 
        w-full bg-white border-r overflow-y-auto
        flex-col h-[80vh] lg:h-auto
      `}>
        <div className="sticky top-0 bg-white z-10 p-3 sm:p-4 border-b">
          <h2 className="text-lg sm:text-xl font-bold flex items-center mb-3">
            <Bus className="mr-2 text-blue-600" size={20} />
            Live Routes
          </h2>

          <div className="relative">
            <Input
              placeholder="Search active route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
              className="w-full"
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {filteredRoutes.length} active route{filteredRoutes.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
          {filteredRoutes.length === 0 && (
            <div className="text-center text-gray-500 mt-6 py-8">
              <Bus className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>No active routes available</p>
              <p className="text-sm mt-1">Try adjusting your search</p>
            </div>
          )}

          {filteredRoutes.map((item) => (
            <Card
              key={item.route._id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRouteId === item.route._id
                  ? "border-blue-600 border-2 bg-blue-50"
                  : "hover:border-gray-300"
              }`}
              onClick={() => handleRouteSelect(item)}
            >
              <Card.Body className="p-3 sm:p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {item.route.routeNumber} - {item.route.routeName}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
                      <MapPin size={12} className="mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {item.route.startPoint} → {item.route.endPoint}
                      </span>
                    </p>
                  </div>

                  <div className="ml-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
                      Live
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs sm:text-sm flex items-center justify-between">
                  <span className="text-gray-600">
                    Active Buses: <strong className="text-blue-600">{item.activeBuses.length}</strong>
                  </span>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL - Map View */}
      <div className={`
        ${!showMobilePanel ? 'flex' : 'hidden'} 
        lg:flex lg:flex-1
        flex-col relative bg-gray-200
        h-[80vh] lg:h-auto
      `}>
        {/* Mobile Header - Only visible when map is shown on mobile */}
        {!showMobilePanel && (
          <div className="lg:hidden sticky top-0 z-20 bg-white border-b p-3 flex items-center">
            <button
              onClick={handleBackToRoutes}
              className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">
                {selectedBus?.route?.routeNumber} - {selectedBus?.route?.routeName}
              </h3>
              <p className="text-xs text-gray-500 flex items-center">
                <Navigation size={10} className="mr-1" />
                Live Tracking
              </p>
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
              Live
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          {!selectedBus && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-center z-10 bg-gray-100 p-4">
              <div>
                <Bus className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-3" />
                <p className="text-sm sm:text-base font-medium">Select a route to start tracking</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Click on any live route from the left panel
                </p>
              </div>
            </div>
          )}

          {selectedBus && (
            <div className="h-full w-full">
              <BusTracker bus={selectedBus} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackBus;