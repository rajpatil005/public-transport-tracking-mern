// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

// Check if user is driver
const isDriver = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'driver') {
    return res.status(403).json({
      success: false,
      message: 'Driver access required'
    });
  }

  next();
};

// Check if user is passenger
const isPassenger = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'passenger') {
    return res.status(403).json({
      success: false,
      message: 'Passenger access required'
    });
  }

  next();
};

// Check if user owns the resource or is admin
const isOwnerOrAdmin = (getUserIdFromResource) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Admin can access any resource
      if (req.user.role === 'admin') {
        return next();
      }

      // Get resource owner ID
      const resourceUserId = await getUserIdFromResource(req);
      
      // Check if user owns the resource
      if (resourceUserId && resourceUserId.toString() === req.user.id) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      });
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authorize,
  isAdmin,
  isDriver,
  isPassenger,
  isOwnerOrAdmin
};