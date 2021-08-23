const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

// filter returned values on requests
const returnFilter = (obj) => {
  let tmp = { ...obj }
  tmp.password_hash = undefined
  tmp.__v = undefined
  tmp.verification = undefined
  return tmp
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  status: { type: String, required: true },
  otp: { type: String },
  city_id: { type: mongoose.Types.ObjectId },
  franchise_id: { type: mongoose.Types.ObjectId },
  role: { type: String, required: true },
  created_by: { type: mongoose.Types.ObjectId },
  verification: {
    email: {
      code: { type: String },
      status: { type: Boolean, default: false },
      request_status: { type: Boolean, default: true },
      verified_at: { type: Date },
    },
  },
  referral_code: { type: String},
  verification_code: { type: String },
  email_verified: { type: Boolean, default: false },
  fcm_token: { type: String },
  
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  return returnFilter(userObject)
}
userSchema.statics.returnFilter = returnFilter
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);