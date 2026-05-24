const jwt = require("jsonwebtoken");

const getJwtSecret = () => process.env.JWT_SECRET || "hospital-dev-secret";

const protect = async (req, res, next) => {

  try {

    let token;

    // CHECK TOKEN
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

      // VERIFY TOKEN
      const decoded = jwt.verify(
        token,
        getJwtSecret()
      );

      // SAVE USER INFO
      req.user = decoded;

      next();

    } else {

      return res.status(401).json({
        message: "Not authorized, no token",
      });

    }

  } catch (error) {

    return res.status(401).json({
      message: "Token failed",
    });

  }

};

const authorizeRoles = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access Denied",
      });

    }

    next();

  };

};

module.exports = {
  protect,
  authorizeRoles,
};
