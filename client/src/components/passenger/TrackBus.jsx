import React, { useEffect, useState } from "react";
import BusTracker from "../maps/BusTracker";
import api from "../../services/api";

const TrackBus = () => {
  const [bus, setBus] = useState(null);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await api.get("/api/buses");
        if (res.data.data.length > 0) {
          setBus(res.data.data[0]); // take first bus
        }
      } catch (err) {
        console.error("Error fetching bus:", err);
      }
    };

    fetchBus();
  }, []);

  if (!bus) return <div>Loading bus...</div>;

  return (
    <div style={{ height: "80vh" }}>
      <BusTracker bus={bus} />
    </div>
  );
};

export default TrackBus;
