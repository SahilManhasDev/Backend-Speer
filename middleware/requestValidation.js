const { body, query } = require('express-validator')
const constatnts = require("../common/constants");
const { USER_STATUS_LIST, USER_ROLES, ORDER_STATUS_LIST } = constatnts;

exports.validate = (method) => {
    switch (method) {
        case 'userLogin': {
            return [
                body('email', 'Invalid email').isEmail(),
                body('password', "Password should have min 6 and max 15 charactors.").exists().isLength({ min: 6, max: 15 }),
            ]
        }
        case 'userCreate': {
            return [
                body('email', 'Invalid email').isEmail(),
                body('password', "Password should have min 6 and max 15 charactors.").exists().isLength({ min: 6, max: 15 }),
                body('name', 'Name cannot be empty.').exists(),
                body('phone', 'Phone must have 10 digits.').isLength({ min: 10, max: 10 }),
                body('status', 'Status cannot be empty.').exists(),
                body('status', 'Status invalid.').isIn(USER_STATUS_LIST)
            ]
        }
        case 'franchiseSubAccount': {
            return [
                body('email', 'Invalid email').isEmail(),
                body('password', "Password should have min 6 and max 15 charactors.").exists().isLength({ min: 6, max: 15 }),
                body('name', 'Name cannot be empty.').exists(),
                body('phone', 'Phone must have 10 digits.').isLength({ min: 10, max: 10 }),
                body('status', 'Status cannot be empty.').exists(),
                body('status', 'Status invalid.').isIn(USER_STATUS_LIST),
                body('user_type', 'User type cannot be empty.').exists(),
                body('user_type', 'User Type invalid.').isIn([USER_ROLES.FRANCHISE_MANAGER,
                USER_ROLES.DRIVER, USER_ROLES.FRANCHISE_STAFF, USER_ROLES.PICKUP_AGENT]),
            ]
        }
        case 'verifyEmail': {
            return [
                body('token', 'Token cannot be empty.').exists(),
            ]
        }
        case 'forgotPassword': {
            return [
                body('email', 'Email cannot be empty.').exists(),
            ]
        }
        case 'resetPassword': {
            return [
                body('reset_token', 'Rest Token cannot be empty.').exists(),
                body('password', 'Password cannot be empty.').exists()
            ]
        }
        case 'fcmToken': {
            return [
                body('fcm_token', 'FCM Token cannot be empty.').exists(),
            ]
        }
        case 'subAccountList': {
            return [
                query('status', 'Invalid status').optional().isIn(USER_STATUS_LIST),
                query('user_type', 'User Type invalid.').optional().isIn([USER_ROLES.FRANCHISE_MANAGER,
                USER_ROLES.DRIVER, USER_ROLES.FRANCHISE_STAFF, USER_ROLES.PICKUP_AGENT])
            ]
        }
        case 'updateSubAccount': {
            return [
                body('status', 'Invalid status').optional().isIn(USER_STATUS_LIST),
                body('phone', 'Phone must have 10 digits.').optional().isLength({ min: 10, max: 10 }),
                // body('password', "Password should have min 6 and max 15 charactors.").optional().isLength({ min: 6, max: 15 }),
            ]
        }
        case 'orderStatusUpdate': {
            return [
                body('status', 'Invalid status').exists().isIn(ORDER_STATUS_LIST)
            ]
        }
        case 'assignOrder': {
            return [
                body('driver_id', 'Driver cannot be empty.').exists()
            ]
        }
    }
}