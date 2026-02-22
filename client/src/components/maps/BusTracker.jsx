import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSocket } from "../../context/SocketProvider";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 🚌 Google-style Bus Icon
const busIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
});

// 🟢 Start Start Pin
const startIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
});

// 🔴 Destination End Pin
const endIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/535/535137.png",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
});

const DEFAULT_CENTER = [16.705, 74.2433];

const BusTracker = ({ bus }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);

  const { on, off, isConnected } = useSocket();

  // ✅ Initialize Map
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("bus-map", {
      center: DEFAULT_CENTER,
      zoom: 14,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const polyline = L.polyline([], {
      weight: 6,
      color: "#2563eb",
      opacity: 0.9,
    }).addTo(map);

    mapRef.current = map;
    polylineRef.current = polyline;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ✅ Load Real Route
  useEffect(() => {
    const fetchRealRoute = async () => {
      if (!bus?.route?.stops || !mapRef.current) return;

      const firstStop = bus.route.stops[0];
      const lastStop = bus.route.stops[bus.route.stops.length - 1];

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${firstStop.lng},${firstStop.lat};${lastStop.lng},${lastStop.lat}?overview=full&geometries=geojson`,
        );

        const data = await response.json();
        const coordinates = data.routes[0].geometry.coordinates;

        const latlngs = coordinates.map((coord) => [coord[1], coord[0]]);

        polylineRef.current.setLatLngs(latlngs);
        mapRef.current.fitBounds(latlngs);

        if (startMarkerRef.current)
          mapRef.current.removeLayer(startMarkerRef.current);
        if (endMarkerRef.current)
          mapRef.current.removeLayer(endMarkerRef.current);

        startMarkerRef.current = L.marker([firstStop.lat, firstStop.lng], {
          icon: startIcon,
        })
          .addTo(mapRef.current)
          .bindPopup(`<b>Start:</b><br/>${firstStop.name}`);

        endMarkerRef.current = L.marker([lastStop.lat, lastStop.lng], {
          icon: endIcon,
        })
          .addTo(mapRef.current)
          .bindPopup(`<b>Destination:</b><br/>${lastStop.name}`);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRealRoute();
  }, [bus]);

  // ✅ Show Bus Safely (handles both lat/lng & latitude/longitude)
  useEffect(() => {
    if (!mapRef.current) return;

    const lat = bus?.location?.lat ?? bus?.location?.latitude ?? null;
    const lng = bus?.location?.lng ?? bus?.location?.longitude ?? null;

    if (!lat || !lng) return;

    const position = [Number(lat), Number(lng)];

    if (markerRef.current) mapRef.current.removeLayer(markerRef.current);

    markerRef.current = L.marker(position, {
      icon: busIcon,
    }).addTo(mapRef.current);

    markerRef.current.bindPopup(
      `<b>Bus ${bus.busNumber}</b><br/>Status: ${bus.status}`,
    );
  }, [bus]);

  // ✅ Live Movement
  useEffect(() => {
    if (!bus?._id) return;

    const handler = (payload) => {
      if (!payload || payload.busId !== bus._id) return;

      const newLat = payload.latitude ?? payload.lat;
      const newLng = payload.longitude ?? payload.lng;

      if (!markerRef.current || !newLat || !newLng) return;

      markerRef.current.setLatLng([Number(newLat), Number(newLng)]);
    };

    on("busLocationUpdate", handler);

    return () => {
      off("busLocationUpdate", handler);
    };
  }, [bus?._id, on, off]);

  return (
    <div className="relative w-full h-full">
      <div id="bus-map" style={{ height: "100%", width: "100%" }} />

      <div
        className="absolute top-4 right-4 bg-white px-4 py-2 rounded shadow"
        style={{ zIndex: 1000 }}
      >
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        {isConnected ? "Live Tracking" : "Offline"}
      </div>
    </div>
  );
};

export default BusTracker;
