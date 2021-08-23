const express = require("express");
const router = express.Router();
const auth = require('../../../middleware/auth')
const { USER_ROLES } = require("../../../common/constants");
const serviceController = require("../service/service.controller");

router.get("/view/:id", auth(USER_ROLES.CUSTOMER), serviceController.view);
router.get("/list", auth(USER_ROLES.CUSTOMER), serviceController.listAll);

module.exports = router;
