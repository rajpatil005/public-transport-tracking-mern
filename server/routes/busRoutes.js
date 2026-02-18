const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");

router.get("/", busController.getAllBuses);
router.put("/:id/location", busController.updateLocation);

module.exports = router;
