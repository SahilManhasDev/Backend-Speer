const express = require("express");
const router = express.Router();
const auth = require('../../../middleware/auth')
const NotificationController = require("../../shared/controller/notification.controller");
const { USER_ROLES } = require("../../../common/constants");

router.get("/", auth(USER_ROLES.DRIVER, USER_ROLES.CUSTOMER, USER_ROLES.ADMIN,
    USER_ROLES.FRANCHISE_MANAGER, USER_ROLES.FRANCHISE_STAFF, USER_ROLES.PICKUP_AGENT,
    USER_ROLES.FRANCHISE_OWNER), NotificationController.listNotifications);
router.delete("/:notification_id", auth(USER_ROLES.DRIVER, USER_ROLES.CUSTOMER, USER_ROLES.ADMIN,
    USER_ROLES.FRANCHISE_MANAGER, USER_ROLES.FRANCHISE_STAFF, USER_ROLES.PICKUP_AGENT,
    USER_ROLES.FRANCHISE_OWNER), NotificationController.deleteNotification);
router.put("/:notification_id/status", auth(USER_ROLES.DRIVER, USER_ROLES.CUSTOMER, USER_ROLES.ADMIN,
    USER_ROLES.FRANCHISE_MANAGER, USER_ROLES.FRANCHISE_STAFF, USER_ROLES.PICKUP_AGENT,
    USER_ROLES.FRANCHISE_OWNER), NotificationController.updateNotificationStatus);

module.exports = router;