const Route = require('../models/Route');
const { kolhapurRoutes } = require('../data/kolhapurData');

// @desc    Get all routes
// @route   GET /api/routes
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    
    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single route
// @route   GET /api/routes/:id
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('schedule.busId');

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create route
// @route   POST /api/routes
exports.createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    
    res.status(201).json({
      success: true,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update route
// @route   PUT /api/routes/:id
exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete route
// @route   DELETE /api/routes/:id
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search routes
// @route   GET /api/routes/search/:query
exports.searchRoutes = async (req, res) => {
  try {
    const { query } = req.params;
    
    const routes = await Route.find({
      $or: [
        { routeNumber: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { source: { $regex: query, $options: 'i' } },
        { destination: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Initialize routes with Kolhapur data
// @route   POST /api/routes/init
exports.initKolhapurRoutes = async (req, res) => {
  try {
    await Route.deleteMany({});
    const routes = await Route.insertMany(kolhapurRoutes);
    
    res.json({
      success: true,
      message: 'Kolhapur routes initialized successfully',
      data: routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};