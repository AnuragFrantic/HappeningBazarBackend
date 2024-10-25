const mongoose = require('mongoose')

const AppliedOfferSchema = new mongoose.Schema({
    code: { type: String, required: true },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    applied_at: { type: Date, default: Date.now },
    status: { type: String, enum: ["used", "expired"], required: true }
});

module.exports = mongoose.model('AppliedOffer', AppliedOfferSchema);
