const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../../models/user");
const config = require("../../../config/var");
const constatnts = require("../../../common/constants");
const { USER_STATUS, USER_ROLES, SALT_ROUNDS } = constatnts;
const {
    app: { jwt_key, app_url }
} = config;
const { validationResult } = require("express-validator");
const ResetTokens = require("../../../models/reset-tokens");
const mongoose = require("mongoose");
const crypto = require("crypto");


/**
 * To authenticate user
 *
 * @method userAuth
 * @param 
 *
 * @returns {json} response
 */
exports.userAuth = function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
        }

        const email = req.body.email;
        const password = req.body.password;
        User.findOne({
            email: email,
            status: USER_STATUS.ACTIVE,
            role: { $in: [USER_ROLES.FRANCHISE_OWNER, USER_ROLES.FRANCHISE_MANAGER, USER_ROLES.FRANCHISE_STAFF, USER_ROLES.PICKUP_AGENT] }
        }, function (err, user) {
            if (!user) {
                return res.status(200).json({
                    success: false,
                    error_message: "User not found"
                });
            }

            const validPassword = bcrypt.compareSync(password, user.password_hash);
            if (!validPassword) {
                return res.status(200).json({
                    success: false,
                    error_message: "Incorrect password"
                });
            }

            const token = jwt.sign(
                { email: user.email, user_id: user._id, role: user.role },
                jwt_key,
                { expiresIn: "10h" }
            );
            return res.status(200).json({
                success: true,
                token: token,
                user_details: user
            });
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Forgot user password
 *
 * @method userForgotPassword
 * @param 
 *
 * @returns {json} response
 */
exports.userForgotPassword = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
    }
    User.findOne({
        email: req.body.email,
        status: USER_STATUS.ACTIVE,
    }, function (err, user) {
        if (!user) {
            return res.status(200).json({
                success: false,
                error_message: "User account not found"
            });
        } else {

            const resetToken = crypto.randomBytes(30).toString('hex');
            const token = new ResetTokens({
                user_id: mongoose.Types.ObjectId(user._id),
                token: resetToken
            })
            token.save(function (err, token) {
                sendMail({
                    body: {
                        name: user.name,
                        intro: "Someone has asked to reset the password for your account." +
                            "If you did not request a password reset, you can disregard this email." +
                            "No changes have been made to your account. </br></br></br>" +
                            "To reset your password, follow this link (or paste into your browser) within the next 15 minutes. </br></br></br>" +
                            app_url + "?reset-verification=" + resetToken
                    }
                }, req.body.email, subjects.passwordResetRequest)
            })
            return res.status(200).json({
                success: true,
                message: 'Password reset link has been sent successfully',
            });
        }
    });
}

/**
 * Forgot user password
 *
 * @method userResetPassword
 * @param 
 *
 * @returns {json} response
 */
exports.userResetPassword = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
    }
    const { reset_token, password } = req.body;
    ResetTokens.findOne({ token: reset_token }, function (err, token) {
        if (token) {
            const password_hash = bcrypt.hashSync(password, SALT_ROUNDS);
            User.findByIdAndUpdate(token.user_id, { $set: { password_hash: password_hash } }, { new: true }, function (err, data) {
                ResetTokens.findOneAndDelete({ token: reset_token }, function (err) { })
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
        } else {
            return res.status(422).json({
                success: false,
                error_message: "Invalid token",
            });
        }
    })

}

/**
 * User verify email account
 *
 * @method verifyEmailAccount
 * @param 
 *
 * @returns {json} response
 */
exports.verifyEmailAccount = function (req, res, next) {
    const { token } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
    }
    User.findOne({ 'verification.email.code': token }, function (err, data) {
        if (data) {
            User.findByIdAndUpdate(data._id, {
                'verification.email.code': '',
                'verification.email.status': true,
                'verification.email.verified_at': new Date()
            }, { new: true }, function (err, user) {
                return res.status(200).json({
                    success: true,
                    message: "Successfully updated",
                });
            })
        } else {
            return res.status(422).json({
                success: false,
                error_message: "Invalid token",
            });
        }
    })
}