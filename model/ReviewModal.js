const mongoose = require("mongoose")


const ReviewSchema = new mongoose.Schema({
    rating: { type: String },
    review: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Register' },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
}, { timestamps: true })



module.exports = mongoose.model('Review', ReviewSchema);