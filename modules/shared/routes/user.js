const express = require("express");
const router = express.Router();
const UserController = require("../../shared/controller/user.controller");
const validation = require('../../../middleware/requestValidation');
const auth = require('../../../middleware/auth')

router.post("/fcmtoken", auth('customer', 'admin', 'franchise_staff', 'pickup_agent',
    'franchise_owner', 'driver', 'franchise_manager'), validation.validate('fcmToken'), UserController.updateFCMToken)
module.exports = router;