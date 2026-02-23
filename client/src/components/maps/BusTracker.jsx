import React, { useEffect, useRef } from "react";
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
  const animationRef = useRef(null);

  const { on, off, isConnected } = useSocket();

  useEffect(() => {
    if (!bus || mapRef.current) return;

    const map = L.map("bus-map").setView(DEFAULT_CENTER, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map,
    );

    polylineRef.current = L.polyline([], { weight: 6 }).addTo(map);

    mapRef.current = map;
  }, [bus]);

  useEffect(() => {
    if (!bus?.route?.stops?.length) return;

    const loadRoute = async () => {
      const stops = bus.route.stops;

      const first = stops[0];
      const last = stops[stops.length - 1];

      const url = `https://router.project-osrm.org/route/v1/driving/${first.lng},${first.lat};${last.lng},${last.lat}?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes?.length) return;

      const path = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);

      polylineRef.current.setLatLngs(path);

      mapRef.current.fitBounds(path, {
        padding: [40, 40],
      });

      L.marker([first.lat, first.lng], { icon: startIcon }).addTo(
        mapRef.current,
      );

      L.marker([last.lat, last.lng], { icon: endIcon }).addTo(mapRef.current);
    };

    loadRoute();
  }, [bus]);

  useEffect(() => {
    if (!bus?.busNumber) return;

    let pathCache = [];
    let progress = 0;

    const SPEED = 0.00008;

    const handler = (payload) => {
      if (!payload || payload.busId !== bus.busNumber) return;

      if (!polylineRef.current) return;

      pathCache = polylineRef.current.getLatLngs();
    };

    on("bus-location-update", handler);

    const animate = () => {
      if (pathCache.length > 1 && markerRef.current && mapRef.current) {
        progress += SPEED;

        if (progress > 1) progress = 0;

        const segmentCount = pathCache.length - 1;

        const virtualIndex = progress * segmentCount;

        const i = Math.floor(virtualIndex);
        const j = Math.min(i + 1, segmentCount);

        const ratio = virtualIndex - i;

        const A = pathCache[i];
        const B = pathCache[j];

        if (A && B) {
          const lat = A.lat + (B.lat - A.lat) * ratio;
          const lng = A.lng + (B.lng - A.lng) * ratio;

          markerRef.current.setLatLng([lat, lng]);
          mapRef.current.panTo([lat, lng], {
            animate: true,
            duration: 0.15,
          });
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (!markerRef.current && polylineRef.current) {
      const path = polylineRef.current.getLatLngs();
      if (path.length) {
        markerRef.current = L.marker(path[0], { icon: busIcon }).addTo(
          mapRef.current,
        );
      }
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      off("bus-location-update", handler);
      cancelAnimationFrame(animationRef.current);
    };
  }, [bus?.busNumber, on, off]);

  return (
    <div style={{ height: "100%" }}>
      <div id="bus-map" style={{ height: "100%" }} />

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "white",
          padding: "6px 14px",
          borderRadius: "8px",
        }}
      >
        {isConnected ? "🟢 Live Tracking" : "🔴 Offline"}
      </div>
    </div>
  );
};

export default BusTracker;
