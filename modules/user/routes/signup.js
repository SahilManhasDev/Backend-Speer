const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const { USER_ROLES } = require("../../../common/constants");
const signupController = require("../signup/signup.controller");
const {
  hasEmail,
  validEmail,
  hasPassword,
  validPassword,
  hasFranchise,
} = require("../signup/signup.validators");
const {
  hasName,
  hasPhone,
  validPhone,
  hasOtp,
  validOtp,
  hasEmailOnCreate,
  validEmailOnCreate,
  hasPasswordOnCreate,
  validPasswordOnCreate,
} = require("../signup/signup.validators");

router.post("/login", 
  [
    hasEmail,
    validEmail,
    hasPassword,
    validPassword
  ], 
  signupController.login
);
router.post("/login-phone", 
  [
    hasPhone,
    validPhone,
  ], 
  signupController.login_phone
);
router.post("/retry-otp", 
  [
    hasPhone,
    validPhone,
  ], 
  signupController.retry_otp
);
router.post("/verify-otp", 
  [ 
    hasPhone,
    validPhone,
    hasOtp,
    validOtp,
  ], 
  signupController.verify_otp
);
router.post("/signup", 
  [
    hasEmailOnCreate,
    validEmailOnCreate,
    hasPasswordOnCreate,
    validPasswordOnCreate,
    hasName,
    hasPhone,
  ], 
  signupController.signup
);

router.post("/update", auth(USER_ROLES.CUSTOMER), 
  [
    hasEmailOnCreate,
    validEmailOnCreate,
    hasName,
    hasPhone,
  ], 
  signupController.update
);
router.post("/update-franchise", auth(USER_ROLES.CUSTOMER), 
  [
    hasFranchise,
  ], 
  signupController.updateUserFranchise
);
router.get("/", auth(USER_ROLES.CUSTOMER), signupController.findById);
router.get("/verify-email-link/:email/:code",signupController.verify_email);

module.exports = router;
