import axios from "axios";
import Route from "../models/Route.js";

/*
========================================
 SIMPLE LOOP SAFE PUBLIC OSRM PATH
========================================
*/

function cleanPublicOSRMPath(path) {
  if (!path?.length) return [];

  const result = [];
  const visited = new Set();

  for (const point of path) {
    const key = point.lat.toFixed(5) + "-" + point.lng.toFixed(5);

    if (!visited.has(key)) {
      result.push(point);
      visited.add(key);
    }
  }

  return result;
}

/*
========================================
 PATH GENERATOR CONTROLLER
========================================
*/

export const generateOSRMPath = async (req, res) => {
  try {
    const { routeId } = req.query;

    if (!routeId) {
      return res.status(400).json({
        success: false,
        message: "routeId required",
      });
    }

    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    if (!route.stops?.length || route.stops.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Minimum 2 stops required",
      });
    }

    /*
    REMOVE DUPLICATE STOPS
    */

    const uniqueStops = [];
    const seen = new Set();

    for (const stop of route.stops) {
      const key = `${stop.lat}-${stop.lng}`;

      if (!seen.has(key)) {
        uniqueStops.push(stop);
        seen.add(key);
      }
    }

    /*
    PUBLIC OSRM REQUEST
    */

    const coords = uniqueStops.map((s) => `${s.lng},${s.lat}`).join(";");

    const osrmUrl =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${coords}?overview=full&geometries=geojson&steps=false&alternatives=false`;

    const response = await axios.get(osrmUrl);

    if (!response.data.routes?.length) {
      return res.status(500).json({
        success: false,
        message: "OSRM path generation failed",
      });
    }

    /*
    EXTRACT PATH
    */

    const geometry = response.data.routes[0].geometry;

    const rawPath = geometry.coordinates.map((c) => ({
      lat: c[1],
      lng: c[0],
    }));

    /*
    CLEAN PATH ⭐ VERY SIMPLE DEMO SAFE METHOD
    */

    const cleanedPath = cleanPublicOSRMPath(rawPath);

    route.path = cleanedPath;

    await route.save();

    res.json({
      success: true,
      message: "Path generated successfully",
      pathLength: cleanedPath.length,
    });
  } catch (err) {
    console.error("Path Generator Error:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
