const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");


// REGISTER
router.post("/register", registerUser);


// LOGIN
router.post("/login", loginUser);


// PROTECTED ROUTE
router.get(
  "/profile",

  protect,

  (req, res) => {

    res.json({
      message: "Protected Route Accessed",
      user: req.user,
    });

  }
);


// ADMIN ONLY ROUTE
router.get(

  "/admin",

  protect,

  authorizeRoles("admin"),

  (req, res) => {

    res.json({
      message: "Welcome Admin",
    });

  }

);


module.exports = router;