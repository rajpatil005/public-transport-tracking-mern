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

const TRACKING_ZOOM = 19;

const BusTracker = ({ bus }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);

  const followRef = useRef(true);
  const [followState, setFollowState] = useState(true);

  const { socket, isConnected } = useSocket();

  /* ================= MAP INIT ================= */

  useEffect(() => {
    if (!bus || mapRef.current) return;

    const map = L.map("bus-map", {
      maxZoom: 22,
      minZoom: 5,
      zoomControl: true,
    }).setView([16.705, 74.2433], TRACKING_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 22,
    }).addTo(map);

    polylineRef.current = L.polyline([], { weight: 6 }).addTo(map);

    map.on("dragstart zoomstart", () => {
      followRef.current = false;
      setFollowState(false);
    });

    mapRef.current = map;
  }, [bus]);

  /* ================= PATH DRAWING ================= */

  useEffect(() => {
    if (!bus?.route?.path?.length || !mapRef.current) return;

    const path = bus.route.path.map((p) => [p.lat, p.lng]);

    polylineRef.current.setLatLngs(path);

    mapRef.current.fitBounds(path, {
      padding: [40, 40],
      animate: true,
    });

    const stops = bus.route.stops || [];

    if (stops.length) {
      L.marker([stops[0].lat, stops[0].lng], {
        icon: startIcon,
      }).addTo(mapRef.current);

      const last = stops[stops.length - 1];

      L.marker([last.lat, last.lng], {
        icon: endIcon,
      }).addTo(mapRef.current);
    }
  }, [bus]);

  /* ================= SOCKET TRACKING ================= */

  useEffect(() => {
    if (!socket) return;

    let animationFrame;
    let startTime;
    let startLatLng = null;
    let targetLatLng = null;
    const duration = 800;

    const animateMarker = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const lat =
        startLatLng.lat + (targetLatLng.lat - startLatLng.lat) * progress;

      const lng =
        startLatLng.lng + (targetLatLng.lng - startLatLng.lng) * progress;

      const current = L.latLng(lat, lng);

      markerRef.current.setLatLng(current);

      if (followRef.current) {
        mapRef.current.panTo(current, { animate: false });
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateMarker);
      }
    };

    const handler = (data) => {
      if (!mapRef.current) return;

      const { latitude, longitude, speed } = data;
      if (!latitude || !longitude) return;

      const newLatLng = L.latLng(latitude, longitude);

      if (!markerRef.current) {
        markerRef.current = L.marker(newLatLng, {
          icon: busIcon,
        }).addTo(mapRef.current);
        return;
      }

      cancelAnimationFrame(animationFrame);

      startLatLng = markerRef.current.getLatLng();
      targetLatLng = newLatLng;
      startTime = null;

      markerRef.current.bindPopup(`🚍 Speed: ${speed || 0} km/h`);

      animationFrame = requestAnimationFrame(animateMarker);
    };

    socket.on("bus-location-update", handler);

    return () => {
      socket.off("bus-location-update", handler);
      cancelAnimationFrame(animationFrame);
    };
  }, [socket]);

  /* ================= RECENTER ================= */

  const handleRecenter = () => {
    if (!mapRef.current || !markerRef.current) return;

    const pos = markerRef.current.getLatLng();
    if (!pos) return;

    followRef.current = true;
    setFollowState(true);

    // Smooth zoom animation
    mapRef.current.flyTo(pos, TRACKING_ZOOM, {
      animate: true,
      duration: 1,
    });

    mapRef.current.once("moveend", () => {
      followRef.current = true;
    });
  };

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
          zIndex: 1000,
        }}
      >
        {isConnected ? "🟢 Live Tracking" : "🔴 Offline"}
      </div>

      {!followState && (
        <button
          onClick={handleRecenter}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            padding: "12px 18px",
            borderRadius: "40px",
            background: "#1976d2",
            color: "white",
            border: "none",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          🎯 Recenter
        </button>
      )}
    </div>
  );
};

export default BusTracker;
