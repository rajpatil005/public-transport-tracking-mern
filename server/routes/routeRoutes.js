import express from "express";
import {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  searchRoutes,
  initKolhapurRoutes,
} from "../controllers/routeController.js";

import { generateOSRMPath } from "../controllers/pathGenerator.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/search/:query", protect, searchRoutes);

router.post("/init", protect, authorize("admin"), initKolhapurRoutes);

/* ⭐ PATH GENERATION ROUTE */
router.get("/generate-path", protect, authorize("admin"), generateOSRMPath);

router.route("/").get(getRoutes).post(protect, authorize("admin"), createRoute);

router
  .route("/:id")
  .get(protect, getRouteById)
  .put(protect, authorize("admin"), updateRoute)
  .delete(protect, authorize("admin"), deleteRoute);

export default router;
