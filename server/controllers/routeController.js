import Route from "../models/Route.js";
import { kolhapurRoutes } from "../data/kolhapurData.js";

/*
==================================================
GET ALL ROUTES
==================================================
*/
export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();

    res.json({
      success: true,
      count: routes.length,
      data: routes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==================================================
GET SINGLE ROUTE
==================================================
*/
export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate(
      "schedule.busId",
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      data: route,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==================================================
CREATE ROUTE
==================================================
*/
export const createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);

    res.status(201).json({
      success: true,
      data: route,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==================================================
UPDATE ROUTE
==================================================
*/
export const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      data: route,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==================================================
DELETE ROUTE
==================================================
*/
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      message: "Route deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==================================================
SEARCH ROUTES
==================================================
*/
export const searchRoutes = async (req, res) => {
  try {
    const { query } = req.params;

    const routes = await Route.find({
      $or: [
        { routeNumber: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { source: { $regex: query, $options: "i" } },
        { destination: { $regex: query, $options: "i" } },
      ],
    });

    res.json({
      success: true,
      count: routes.length,
      data: routes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==================================================
INITIALIZE KOLHAPUR ROUTES
==================================================
*/
export const initKolhapurRoutes = async (req, res) => {
  try {
    await Route.deleteMany({});

    const routes = await Route.insertMany(kolhapurRoutes);

    res.json({
      success: true,
      message: "Kolhapur routes initialized successfully",
      data: routes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
