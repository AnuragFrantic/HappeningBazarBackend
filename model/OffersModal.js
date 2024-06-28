const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    deleted_price: { type: String },
    real_price: { type: String },
    offer_detail: [
        {
            detail: { type: String },
            validity: { type: String },
            redeem: { type: String },
            terms: { type: String }
        }
    ],
    created_by: { type: mongoose.Schema.Types.ObjectId, require: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Offer', OfferSchema);
