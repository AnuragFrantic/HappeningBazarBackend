const mongoose = require("mongoose")



const GeneratedCodeSchema = new mongoose.Schema({
    code: { type: String, sparse: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Register" },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Register" },
    valid_until: { type: Date },
    status: { type: String, enum: ["active", "used", "expired"], default: "active" },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" }, // Reference back to the Offer
}, { timestamps: true });

module.exports = mongoose.model('GeneratedCode', GeneratedCodeSchema);
