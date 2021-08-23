const bcrypt = require("bcrypt");
const User = require("../../../models/user");
const { SALT_ROUNDS, USER_ROLES } = require("../../../common/constants");
const { validationResult } = require("express-validator");

/**
 * Update user password
 *
 * @method userUpdatePassword
 * @param 
 *
 * @returns {json} response
 */
exports.userUpdatePassword = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
    }
    const { current_password, new_password } = req.body;
    User.findById(req.userData.userId, function (err, user) {
        const validPassword = bcrypt.compareSync(current_password, user.password_hash);
        if (!validPassword) {
            return res.status(200).json({
                success: false,
                error_message: "Incorrect current password"
            })
        } else {
            const currentPassword = bcrypt.compareSync(new_password, user.password_hash);
            if (currentPassword) {
                return res.status(422).json({
                    success: false,
                    error_message: "New and old password can't be same",
                });
            }
            const password_hash = bcrypt.hashSync(new_password, SALT_ROUNDS);
            User.findByIdAndUpdate(req.userData.userId, { $set: { password_hash: password_hash } }, { new: true }, function (err, data) {
                sendMail({
                    body: {
                        name: data.name,
                        intro: mailBody.passwordResetSuccess,
                    },
                }, data.email, subjects.passwordResetSuccess)
                return res.status(200).json({
                    success: true,
                    message: "Successfully updated",
                });
            })
        }
    })
}

/**
 * Update fcm token
 *
 * @method updateFCM
 * @param 
 *
 * @returns {json} response
 */
exports.updateFCMToken = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
    }
    User.findByIdAndUpdate(req.userData.userId, { $set: { fcm_token: req.body.fcm_token } }, { new: true }, function (err, data) {
        return res.status(200).json({
            success: true,
            message: "Successfully updated",
        });
    })
}

/**
 * Update fcm token
 *
 * @method isReferalCodeValid
 * @param 
 *
 * @returns {json} response
 */
exports.isReferalCodeValid = function (referral_code) {
    return new Promise((resolve, reject) => {
        User.findOne({ role: USER_ROLES.CUSTOMER, referral_code: referral_code }, function (err, user) {
            resolve(user)
        })
    })
}

/**
 * Update fcm token
 *
 * @method getUser
 * @param 
 *
 * @returns {json} response
 */
exports.getUser = function (filter) {
    return new Promise((resolve, reject) => {
        User.findOne(filter, function (err, user) {
            resolve(user)
        })
    })
}