import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSocket } from "../../context/SocketProvider";

/* ================= ICON SETUP ================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const busIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
});

const startIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const endIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DEFAULT_CENTER = [16.705, 74.2433];

const BusTracker = ({ bus }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);

  const { on, off, isConnected, socket } = useSocket();

  /* ================= MAP INIT ================= */

  useEffect(() => {
    if (mapRef.current) return;

    const container = document.getElementById("bus-map");
    if (!container) return;

    const map = L.map(container, {
      center: DEFAULT_CENTER,
      zoom: 14,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    polylineRef.current = L.polyline([], {
      weight: 6,
      color: "#2563eb",
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* ================= SOCKET ROOM JOIN ================= */

  useEffect(() => {
    if (!socket || !bus?.busNumber) return;

    socket.emit("track-bus", bus.busNumber);
  }, [socket, bus?.busNumber]);

  /* ================= ROUTE FETCH ================= */

  useEffect(() => {
    const fetchRoute = async () => {
      if (!bus?.route?.stops?.length || !mapRef.current) return;

      try {
        const stops = bus.route.stops;

        const first = stops[0];
        const last = stops[stops.length - 1];

        const url = `https://router.project-osrm.org/route/v1/driving/${first.lng},${first.lat};${last.lng},${last.lat}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.routes?.length) return;

        const path = data.routes[0].geometry.coordinates.map((c) => [
          c[1],
          c[0],
        ]);

        polylineRef.current?.setLatLngs(path);

        setTimeout(() => {
          if (mapRef.current && path.length) {
            mapRef.current.invalidateSize();
            mapRef.current.fitBounds(path);
          }
        }, 400);

        startMarkerRef.current?.remove();
        endMarkerRef.current?.remove();

        startMarkerRef.current = L.marker([first.lat, first.lng], {
          icon: startIcon,
        }).addTo(mapRef.current);

        endMarkerRef.current = L.marker([last.lat, last.lng], {
          icon: endIcon,
        }).addTo(mapRef.current);
      } catch (err) {
        console.error("Route fetch error", err);
      }
    };

    setTimeout(fetchRoute, 500);
  }, [bus]);

  /* ================= LIVE TRACKING ================= */

  useEffect(() => {
    if (!bus?.busNumber) return;

    const handler = (payload) => {
      if (!payload || payload.busId !== bus.busNumber) return;
      if (!mapRef.current) return;

      const lat = Number(payload.latitude);
      const lng = Number(payload.longitude);

      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], {
          icon: busIcon,
        }).addTo(mapRef.current);
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }

      mapRef.current.panTo([lat, lng], { animate: true });
    };

    on("bus-location-update", handler);

    return () => off("bus-location-update", handler);
  }, [bus?.busNumber, on, off]);

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
