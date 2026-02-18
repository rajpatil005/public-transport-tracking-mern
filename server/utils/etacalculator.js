const calculateETA = (currentLocation, stops, averageSpeed = 30) => {
  // This is a simplified ETA calculator
  // In production, you'd use Google Maps API or similar
  
  const distances = [];
  let totalDistance = 0;

  // Calculate distance to each stop
  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i];
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      stop.latitude,
      stop.longitude
    );
    distances.push({
      stopName: stop.name,
      distance,
      eta: Math.round((distance / averageSpeed) * 60) // ETA in minutes
    });
    totalDistance += distance;
  }

  return {
    nextStop: distances[0],
    allStops: distances,
    totalETA: Math.round((totalDistance / averageSpeed) * 60)
  };
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

module.exports = { calculateETA, calculateDistance };