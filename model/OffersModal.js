const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the offer or coupon
    description: { type: String, required: true }, // Description of the offer
    deleted_price: { type: String }, // Original price (crossed out in UI)
    real_price: { type: String }, // Actual price after discount
    membership: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" }, // Reference to Membership
    min_off: { type: String }, // Minimum discount
    max_off: { type: String }, // Maximum discount

    // Offer type (either Percent or Value)
    type: {
        type: String,
        enum: ["Percent", "Value"],
        required: true
    },

    offer_detail: [
        {
            detail: { type: String }, // Detail of the offer
            validity: { type: String }, // Validity period of the offer
            redeem: { type: String }, // Redeem information
            terms: { type: String } // Terms and conditions of the offer
        }
    ],

    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, // Reference to the user who created the offer

    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },

    code: { type: String, required: true, unique: true }, // Unique coupon code
    discount_amount: { type: String, required: true }, // Discount amount if applicable
    discount_percentage: { type: String }, // Discount percentage if applicable
    minimum_purchase: { type: String }, // Minimum purchase amount required for applying the coupon
    maximum_discount: { type: String }, // Maximum discount that can be applied
    usage_limit: { type: Number, default: 1 }, // How many times a coupon can be used
    expiry_date: { type: Date, required: true }, // Expiration date of the coupon


    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Offer', OfferSchema);
