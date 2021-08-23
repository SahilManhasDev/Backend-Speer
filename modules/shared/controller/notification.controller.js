const { firebaseSendMessage } = require("../../../services/firebase");
const Notifications = require("../../../models/notifications");
const mongoose = require("mongoose");
const { getPageData, getPagination } = require("../../../common/utils");

/**
 * Send notifications
 *
 * @method sendPushNotification
 * @param 
 *
 * @returns {json} response
 */
exports.sendPushNotification = function (token, message) {
    firebaseSendMessage(token, message)
}

/**
 * Save notifications
 *
 * @method saveNotification
 * @param 
 *
 * @returns {json} response
 */
exports.saveNotification = function (data) {
    return new Promise((resolve, reject) => {
        const notification = new Notifications(data);
        notification.save(function (err, result) {
            resolve(result)
        })
    })
}

/**
 * List notifications
 *
 * @method listNotifications
 * @param 
 *
 * @returns {json} response
 */
exports.listNotifications = function (req, res, next) {
    const { status, skip, limit, type } = req.query;
    const page = getPageData(skip, limit);
    const filter = {
        user_id: mongoose.Types.ObjectId(req.userData.userId),
        is_deleted: false
    }
    if (status) {
        switch (status) {
            case 'read':
                filter.is_read = true
                break;
            case 'unread':
                filter.is_read = false
                break;
            default:
                break;
        }

    }
    if (status) {
        filter.type = type
    }
    const pipeline = [
        {
            $match: filter
        },
        {
            $project: {
                __v: 0
            }
        },
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: page.skip }, { $limit: page.limit }]
            }
        }
    ]
    Notifications.aggregate(pipeline, async function (err, data) {
        const response = {
            pagination: await getPagination(0, page.skip, page.limit),
            notifications: []
        }
        if (data[0]) {
            if (data[0].metadata[0]) {
                response.pagination = await getPagination(data[0].metadata[0].total, page.skip, page.limit)
            }
            response.notifications = data[0].data;
        }
        return res.status(200).json({
            success: true,
            ...response
        });
    })
}


/**
 * Delete notifications
 *
 * @method deleteNotification
 * @param 
 *
 * @returns {json} response
 */
exports.deleteNotification = function (req, res, next) {
    Notifications.findByIdAndUpdate(req.params.notification_id, { is_deleted: true }, {}, function (err, data) {
        return res.status(200).json({
            success: true,
            message: 'Successfully deleted'
        });
    })
}

/**
 * Update notifications
 *
 * @method updateNotificationStatus
 * @param 
 *
 * @returns {json} response
 */
exports.updateNotificationStatus = function (req, res) {
    Notifications.findByIdAndUpdate(req.params.notification_id, { is_read: req.body.is_read }, { new: true }, function (err, data) {
        return res.status(200).json({
            success: true,
            message: 'Successfully updated'
        });
    })
}