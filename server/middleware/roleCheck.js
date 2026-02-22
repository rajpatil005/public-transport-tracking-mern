export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

export const isDriver = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "driver") {
    return res.status(403).json({
      success: false,
      message: "Driver access required",
    });
  }

  next();
};

export const isPassenger = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "passenger") {
    return res.status(403).json({
      success: false,
      message: "Passenger access required",
    });
  }

  next();
};

export const isOwnerOrAdmin = (getUserIdFromResource) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (req.user.role === "admin") {
        return next();
      }

      const resourceUserId = await getUserIdFromResource(req);

      if (resourceUserId && resourceUserId.toString() === req.user.id) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    } catch (error) {
      next(error);
    }
  };
};
