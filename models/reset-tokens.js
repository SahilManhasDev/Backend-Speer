const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

const ResetTokensSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    token: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
ResetTokensSchema.index({ created_at: 1 }, { expireAfterSeconds: 900 }); // expire after 15 minute

ResetTokensSchema.methods.toJSON = function () {
    const resetTokens = this
    const resetTokensObject = resetTokens.toObject()
    return returnFilter(resetTokensObject)
}
ResetTokensSchema.statics.returnFilter = returnFilter

module.exports = mongoose.model("Reset_Tokens", ResetTokensSchema);