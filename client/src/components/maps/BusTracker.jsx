import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSocket } from '../../context/SocketProvider';

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Bus icon
const busIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61212.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const DEFAULT_CENTER = [16.7050, 74.2433];

const BusTracker = ({ bus }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const routePointsRef = useRef([]);
  const { isConnected } = useSocket();

  // ✅ Create map only once
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map('bus-map', {
      center: DEFAULT_CENTER,
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const polyline = L.polyline([], {
      color: '#1890ff',
      weight: 4,
    }).addTo(map);

    mapRef.current = map;
    polylineRef.current = polyline;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ✅ Update bus safely
  useEffect(() => {
    if (!mapRef.current) return;
    if (!bus?.currentLocation) return;

    const lat = Number(bus.currentLocation.lat);
    const lng = Number(bus.currentLocation.lng);

    if (isNaN(lat) || isNaN(lng)) return;

    const newPos = [lat, lng];

    // Create marker if not exists
    if (!markerRef.current) {
      markerRef.current = L.marker(newPos, { icon: busIcon }).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng(newPos);
    }

    markerRef.current.bindPopup(`
      <b>Bus ${bus.busNumber || bus.vehicleNumber}</b><br>
      Speed: ${bus.speed || 0} km/h<br>
      Status: ${bus.status || 'active'}
    `);

    // Update route trail
    routePointsRef.current.push(newPos);
    if (routePointsRef.current.length > 50) {
      routePointsRef.current.shift();
    }

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(routePointsRef.current);
    }

    // ✅ SAFE center update (NO animation)
    mapRef.current.setView(newPos);

  }, [bus?.currentLocation]);

  return (
    <div className="relative w-full h-full">
      <div id="bus-map" style={{ height: '100%', width: '100%' }} />

      {/* Status Indicator */}
      <div
        className="absolute top-4 right-4 bg-white px-4 py-2 rounded shadow"
        style={{ zIndex: 1000 }}
      >
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        {isConnected ? 'Live Tracking' : 'Offline'}
      </div>
    </div>
  );
};

export default BusTracker;
