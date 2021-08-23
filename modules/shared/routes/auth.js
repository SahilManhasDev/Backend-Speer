const express = require("express");
const router = express.Router();
const AuthController = require("../../shared/controller/auth.controller");
const validation = require('../../../middleware/requestValidation');

router.post("/forgot-password", validation.validate('forgotPassword'), AuthController.userForgotPassword)
router.post("/reset-password", validation.validate('resetPassword'), AuthController.userResetPassword)
router.post("/verify-email", validation.validate('verifyEmail'), AuthController.verifyEmailAccount)

module.exports = router;