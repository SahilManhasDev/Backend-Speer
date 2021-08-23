const express = require("express");
const router = express.Router();
const signupRoutes = require("./signup");


/**
 * Signup routes
 */
router.use("/user", signupRoutes);



module.exports = router;
