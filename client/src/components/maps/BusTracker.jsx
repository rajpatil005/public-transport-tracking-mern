import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSocket } from "../../context/SocketProvider";

const busIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const startIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [35, 35],
});

const endIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [35, 35],
});

const DEFAULT_CENTER = [16.705, 74.2433];

const BusTracker = ({ bus }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const { socket, isConnected } = useSocket();

  /* ================= MAP INIT ================= */

  useEffect(() => {
    if (!bus || mapRef.current) return;

    const map = L.map("bus-map").setView(DEFAULT_CENTER, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map,
    );

    polylineRef.current = L.polyline([], { weight: 6 }).addTo(map);

    mapRef.current = map;
    setMapReady(true);
  }, [bus]);

  /* ================= DRAW ROUTE ================= */

  useEffect(() => {
    if (!bus?.route?.stops?.length || !mapReady) return;

    const stops = bus.route.stops;
    const first = stops[0];
    const last = stops[stops.length - 1];

    if (bus.route.path?.length) {
      const path = bus.route.path.map((p) => [p.lat, p.lng]);
      polylineRef.current.setLatLngs(path);
      mapRef.current.fitBounds(path, { padding: [40, 40] });
    }

    L.marker([first.lat, first.lng], { icon: startIcon }).addTo(mapRef.current);
    L.marker([last.lat, last.lng], { icon: endIcon }).addTo(mapRef.current);
  }, [bus, mapReady]);

  /* ================= SOCKET LISTENER ================= */

  useEffect(() => {
    if (!socket || !mapReady) return;

    console.log("🎯 Listening for bus updates...");

    socket.on("bus-location-update", (data) => {
      const { latitude, longitude, speed } = data;

      if (!latitude || !longitude) return;

      if (!markerRef.current) {
        markerRef.current = L.marker([latitude, longitude], {
          icon: busIcon,
        }).addTo(mapRef.current);
      } else {
        markerRef.current.setLatLng([latitude, longitude]);
      }

      markerRef.current.bindPopup(`🚍 Speed: ${speed || 0} km/h`);

      mapRef.current.setView([latitude, longitude], mapRef.current.getZoom(), {
        animate: true,
      });
    });

    return () => {
      socket.off("bus-location-update");
    };
  }, [socket, mapReady]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div id="bus-map" style={{ height: "100%" }} />

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "white",
          padding: "6px 14px",
          borderRadius: "8px",
          fontWeight: "600",
        }}
      >
        {isConnected ? "🟢 Live Tracking" : "🔴 Offline"}
      </div>
    </div>
  );
};

export default BusTracker;
