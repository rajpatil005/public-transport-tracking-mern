import Route from "../models/Route.js";
export const generateOSRMPath = async (req, res) => {
  try {
    const route = await Route.findOne();

    if (!route) {
      return res.status(404).json({
        message: "Route not found",
      });
    }

    const stops = route.stops;

    if (stops.length < 2) {
      return res.status(400).json({
        message: "Need at least 2 stops",
      });
    }

    let osrmUrl = "https://router.project-osrm.org/route/v1/driving/";

    const coords = stops.map((s) => `${s.lng},${s.lat}`).join(";");

    osrmUrl += coords + "?overview=full&geometries=geojson";

    const response = await fetch(osrmUrl);
    const data = await response.json();

    if (!data.routes?.length) {
      return res.status(500).json({
        message: "OSRM path fetch failed",
      });
    }

    const path = data.routes[0].geometry.coordinates.map((c) => ({
      lat: c[1],
      lng: c[0],
    }));

    await Route.updateOne({ _id: route._id }, { path });

    res.json({
      message: "Path generated successfully",
      pathLength: path.length,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
