const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../../models/user");
const config = require("../../../config/var");
const constatnts = require("../../../common/constants");
const { USER_STATUS, USER_ROLES, SALT_ROUNDS } = constatnts;
const { app: { jwt_key } } = config;
const signupSubscriber = require("./signup.subscribers");
const SendOtp = require('sendotp');
const sendOtp = new SendOtp(process.env.MSG91_AUTH_KEY, 'Otp for verification is {{otp}}, please do not share it with anybody.');
const { validationResult } = require("express-validator");
const sendEmail = require('../../../utils/send_email');
const randtoken = require('rand-token');
const { generateReferalCode } = require("../../../common/utils");
const { isReferalCodeValid } = require("../../shared/controller/user.controller");


exports.login = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
		}

		const email = req.body.email;
		const password = req.body.password;

		const user = await User.findOne({ email: email, status: USER_STATUS.ACTIVE, role: USER_ROLES.CUSTOMER });
		if (!user) {
			return res.status(200).json({
				success: false,
				message: "User not found"
			});
		}

		const validPassword = bcrypt.compareSync(password, user.password_hash);
		if (!validPassword) {
			return res.status(200).json({
				success: false,
				message: "Incorrect password"

			});
		}
		if (!user.email_verified) {

			return res.status(200).json({
				success: false,
				message: "Email is not verified"

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
		});
	} catch (err) {
		next(err);
	}
};
//login by phone
exports.login_phone = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
		}

		const phone = req.body.phone;
		const user = await User.findOne({ phone: phone, status: USER_STATUS.ACTIVE, role: USER_ROLES.CUSTOMER });
		let otp = Math.floor(1000 + Math.random() * 9000);
		if (!user) {
			return res.status(200).json({
				success: false,
				error_message: "User not found"
			});
		}
		const otp_hash = bcrypt.hashSync(otp.toString(), SALT_ROUNDS);
		const updated_data = {
			_id: user._id,
			otp: otp_hash,
			updated_at: new Date(),
		}
		let newphone = '+91' + phone;
		const updated_user = await User.updateOne({ _id: user._id }, updated_data);
		sendOtp.send(newphone, process.env.MSG91_SENDER_ID, otp, function (error, data) {
			return res.status(200).json({
				success: true,
				message: 'An OTP has been sent to your mobile number',
			});
		});

	} catch (err) {
		next(err);
	}
};
//Retry with call
exports.retry_otp = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
		}

		const phone = req.body.phone;
		const user = await User.findOne({ phone: phone, status: USER_STATUS.ACTIVE, role: USER_ROLES.CUSTOMER });
		if (!user) {
			return res.status(200).json({
				success: false,
				error_message: "User not found"
			});
		}
		let newphone = '+91' + phone;
		sendOtp.retry(newphone, true, function (error, data) {
			return res.status(200).json({
				success: true,
				message: 'Get a call from us',
			});
		});

	} catch (err) {
		next(err);
	}
};
//verify-otp
exports.verify_otp = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
		}

		const otp = req.body.otp;
		const phone = req.body.phone;
		const user = await User.findOne({ phone: phone });
		if (!user) {
			return res.status(200).json({
				success: false,
				error_message: "User not found"
			});
		}
		const validOtp = bcrypt.compareSync(otp, user.otp);
		if (!validOtp) {
			return res.status(200).json({
				success: false,
				error_message: "OTP does not match"
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
			phone_verified: true
		});

	} catch (err) {
		next(err);
	}
};

exports.signup = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
		}
		const body = req.body;

		if (body.referral_code) {
			const referalUser = isReferalCodeValid(body.referral_code)
			if (referalUser) {
				// to do referal user collection
			} else {
				return res.status(422).json({
					success: false,
					message: "Invalid referal code"
				});
			}
		}
		const user_exists = await User.findOne({
			$or: [
				{ email: body.email }, { phone: body.phone }
			]
		});
		if (user_exists) {
			return res.status(200).json({
				success: false,
				message: "User already exists"
			});
		}
		var tmpToken = randtoken.generate(30);
		const password_hash = bcrypt.hashSync(body.password, SALT_ROUNDS);
		let user = new User();
		user.name = body.name;
		user.email = body.email;
		user.phone = body.phone;
		user.city_id = body.city;
		user.password_hash = password_hash;
		user.verification_code = tmpToken;
		user.status = USER_STATUS.ACTIVE;
		user.role = USER_ROLES.CUSTOMER;
		user.email_verified = true;
		user.referral_code = await generateReferalCode();
		user.created_at = new Date();
		user.updated_at = new Date();
		user.save(function (err, user) {
			if (err) {
				console.log(err);
				return res.status(422).json({
					success: false,
					message: 'Something went wrong pls try later'
				});
			}
			var registerEmail = new sendEmail(body.email, 'accountActivation', tmpToken, 'verify-email-link');
			registerEmail.email()
				.then(sent => {
					return sent;
				})
				.catch(sentErr => {
					return sentErr;
				})
			return res.status(200).json({
				success: true,
				user_id: user._id,
			});
		});
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
		}
		const body = req.body;
		const user = await User.findOne({ _id: req.userData.userId });
		if (!user) {
			return res.status(200).json({
				success: false,
				message: "User not found"
			});
		}
		const user_exists = await User.findOne({
			$and: [
				{ _id: { $ne: req.userData.userId } },
				{
					$or: [
						{ email: body.email }, { phone: body.phone }
					]
				}
			]
		});
		if (user_exists) {
			return res.status(200).json({
				success: false,
				message: "User already exists"
			});
		}
		const updated_data = {
			_id: req.userData.userId,
			name: body.name,
			email: body.email,
			phone: body.phone,
			city_id: body.city,
			updated_at: new Date(),
		}
		const updated_user = await User.updateOne({ _id: req.userData.userId }, updated_data);
		return res.status(200).json({
			success: true,
			user_id: updated_data._id,
		});
	} catch (err) {
		next(err);
	}
};

exports.updateUserFranchise = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
		}
		const body = req.body;
		const user = await User.findOne({ _id: req.userData.userId });
		if (!user) {
			return res.status(200).json({
				success: false,
				message: "User not found"
			});
		}
		const updated_data = {
			_id: req.userData.userId,
			franchise_id: body.franchise,
			updated_at: new Date(),
		}
		const updated_user = await User.updateOne({ _id: req.userData.userId }, updated_data);
		return res.status(200).json({
			success: true,
			user_id: updated_data._id,
		});
	} catch (err) {
		next(err);
	}
};

exports.findById = async (req, res, next) => {
	try {
		User.findById(req.userData.userId)
			.then((user) => {
				if (user) {
					return res.status(200).json({
						success: true,
						user: user,
					});
				} else {
					return res.status(404).json({ success: false, message: "User not found!" });
				}
			})
			.catch((error) => {
				res.status(500).json({
					success: false,
					message: "Fetching user failed!",
				});
			});
	} catch (err) {
		next(err);
	}
};

//verify-Email//
exports.verify_email = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ "errors": errors.array({ onlyFirstError: true }) });
		}
		const user = await User.findOne({ email: req.params.email, status: USER_STATUS.ACTIVE, role: USER_ROLES.CUSTOMER });
		if (!user) {
			return res.status(200).json({
				success: false,
				message: "User not found"
			});
		}
		if (user.email == req.params.email) {
			const updated_data = {
				email_verified: true
			}
			const updated_user = await User.updateOne({ _id: user.id }, updated_data);
			return res.status(200).json({
				success: true,
				user: user.id,
				message: 'Email is verified'
			});
		}
		else {
			return res.status(404).json({ success: false, message: "Verification code is not valid" });
		}
	} catch (err) {
		next(err);
	}
};