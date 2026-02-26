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

const stopIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/2698/2698545.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const TRACKING_ZOOM = 19;

const BusTracker = ({ bus }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);

  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const stopMarkersRef = useRef([]);

  const followRef = useRef(true);
  const [followState, setFollowState] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentRouteRef = useRef(null);

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

  /* ================= ROUTE SWITCH TELEPORT ================= */

  useEffect(() => {
    if (!bus?.route || !mapRef.current) return;

    const newRoute = bus.route.routeNumber;

    if (currentRouteRef.current !== newRoute) {
      currentRouteRef.current = newRoute;

      followRef.current = true;
      setFollowState(true);

      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }

      const firstPoint = bus.route.path?.[0];
      if (firstPoint?.lat && firstPoint?.lng) {
        const latLng = L.latLng(firstPoint.lat, firstPoint.lng);

        markerRef.current = L.marker(latLng, {
          icon: busIcon,
        }).addTo(mapRef.current);

        mapRef.current.setView(latLng, TRACKING_ZOOM, {
          animate: false,
        });
      }
    }
  }, [bus?.route?.routeNumber]);

  /* ================= PATH + STOPS DRAWING ================= */

  useEffect(() => {
    if (!bus?.route?.path || !mapRef.current) return;

    const map = mapRef.current;

    const path = bus.route.path
      .filter((p) => p?.lat && p?.lng)
      .map((p) => [p.lat, p.lng]);

    if (!path.length) return;

    polylineRef.current?.setLatLngs(path);

    map.fitBounds(path, {
      padding: [40, 40],
      animate: true,
    });

    stopMarkersRef.current.forEach((m) => map.removeLayer(m));
    stopMarkersRef.current = [];

    if (startMarkerRef.current) map.removeLayer(startMarkerRef.current);
    if (endMarkerRef.current) map.removeLayer(endMarkerRef.current);

    const stops = bus.route.stops || [];
    if (!stops.length) return;

    stops.forEach((stop, index) => {
      const lat = stop.latitude ?? stop.lat;
      const lng = stop.longitude ?? stop.lng;

      if (lat == null || lng == null) return; // prevent crash

      if (index === 0) {
        startMarkerRef.current = L.marker([lat, lng], {
          icon: startIcon,
        })
          .addTo(map)
          .bindPopup(`<b>Start:</b> ${stop.name}`);
        return;
      }

      if (index === stops.length - 1) {
        endMarkerRef.current = L.marker([lat, lng], {
          icon: endIcon,
        })
          .addTo(map)
          .bindPopup(`<b>End:</b> ${stop.name}`);
        return;
      }

      const stopMarker = L.marker([lat, lng], {
        icon: stopIcon,
      })
        .addTo(map)
        .bindPopup(stop.name);

      stopMarkersRef.current.push(stopMarker);
    });

    setTimeout(() => map.invalidateSize(), 200);
  }, [bus?.route]);

  /* ================= SOCKET TRACKING (UNCHANGED SMOOTH) ================= */

  useEffect(() => {
    if (!socket || !bus?.route) return;

    let animationFrame;
    let startTime;
    let startLatLng = null;
    let targetLatLng = null;

    const duration = 600;
    const hasInitializedRef = { current: false };

    const animateMarker = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);

      const lat =
        startLatLng.lat + (targetLatLng.lat - startLatLng.lat) * progress;

      const lng =
        startLatLng.lng + (targetLatLng.lng - startLatLng.lng) * progress;

      const current = L.latLng(lat, lng);

      markerRef.current?.setLatLng(current);

      if (followRef.current && mapRef.current) {
        mapRef.current.panTo(current, { animate: false });
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateMarker);
      }
    };

    const handler = (data) => {
      if (!mapRef.current || !bus?.route) return;

      const { latitude, longitude, speed, routeNumber } = data;

      if (
        bus.route.routeNumber &&
        routeNumber &&
        routeNumber !== bus.route.routeNumber
      ) {
        return;
      }

      if (!latitude || !longitude) return;

      const newLatLng = L.latLng(latitude, longitude);

      if (!markerRef.current) {
        markerRef.current = L.marker(newLatLng, {
          icon: busIcon,
        }).addTo(mapRef.current);

        hasInitializedRef.current = true;
        return;
      }

      if (!hasInitializedRef.current) {
        markerRef.current.setLatLng(newLatLng);
        hasInitializedRef.current = true;
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
  }, [socket, bus]);

  /* ================= CONTROLS (UNCHANGED — RECENTER SAFE) ================= */

  const handleRecenter = () => {
    if (!mapRef.current || !markerRef.current) return;

    followRef.current = true;
    setFollowState(true);

    const pos = markerRef.current.getLatLng();

    mapRef.current.flyTo(pos, TRACKING_ZOOM, {
      animate: true,
      duration: 1,
    });

    mapRef.current.once("moveend", () => {
      followRef.current = true;
    });
  };

  const handleFullRoute = () => {
    if (!mapRef.current || !polylineRef.current) return;

    followRef.current = false;
    setFollowState(false);

    const bounds = polylineRef.current.getBounds();
    mapRef.current.fitBounds(bounds, {
      padding: [40, 40],
      animate: true,
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }

    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 300);
  };

  return (
    <div ref={containerRef} style={{ height: "100%", position: "relative" }}>
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

      <button
        onClick={toggleFullscreen}
        style={{
          position: "absolute",
          top: 55,
          right: 10,
          padding: "6px 12px",
          borderRadius: "6px",
          border: "none",
          background: "#1976d2",
          color: "white",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {isFullscreen ? "⤢ Exit Fullscreen" : "⤢ Fullscreen"}
      </button>

      <button
        onClick={handleFullRoute}
        style={{
          position: "absolute",
          bottom: 80,
          right: 20,
          padding: "12px 18px",
          borderRadius: "40px",
          background: "#555",
          color: "white",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        🗺️ Full Route
      </button>

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
