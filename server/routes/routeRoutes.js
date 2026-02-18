const express = require('express');
const router = express.Router();
const {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  searchRoutes,
  initKolhapurRoutes
} = require('../controllers/routeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/search/:query', protect, searchRoutes);
router.post('/init', protect, authorize('admin'), initKolhapurRoutes);

router.route('/')
  .get(protect, getRoutes)
  .post(protect, authorize('admin'), createRoute);

router.route('/:id')
  .get(protect, getRouteById)
  .put(protect, authorize('admin'), updateRoute)
  .delete(protect, authorize('admin'), deleteRoute);

module.exports = router;