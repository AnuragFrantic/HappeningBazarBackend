const mongoose = require("mongoose");
const { default: slugify } = require("slugify");



const OfferSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    deleted_price: { type: Number },
    real_price: { type: Number },
    membership: { type: String },
    min_off: { type: Number },
    max_off: { type: Number },
    alluser: { type: String },
    image: { type: String },
    type: { type: String, enum: ["Percent", "Value"], required: true },
    offer_detail: { type: String },
    offer_validity: { type: String },
    offer_redeem: { type: String },
    offer_terms: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    discount_amount: { type: Number },
    discount_percentage: { type: String },
    minimum_purchase: { type: Number },
    maximum_discount: { type: Number },
    todayapply: { type: Number },
    todaydate: { type: Date },
    usage_limit: { type: Number, default: 1 },
    daily_limit: { type: Number },
    start_date: { type: Date },
    expiry_date: { type: Date },
    state: { type: String },
    city: { type: String },
    sector: { type: String },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    url: {
        type: String,
        unique: true,
        required: true
    },
    generated_codes: [{ type: mongoose.Schema.Types.ObjectId, ref: "GeneratedCode" }] // Reference to GeneratedCode
}, { timestamps: true });

// Slug generation and middleware remain the same
OfferSchema.pre('save', function (next) {
    if (this.isNew) {
        if (!this.generated_codes) {
            this.generated_codes = [];
        }
    }
    next();
});

OfferSchema.pre('validate', async function (next) {
    if (this.name) {
        let baseSlug = slugify(this.name, { lower: true, remove: /[*+~.()'"!:@/]/g });

        const existingOffer = await mongoose.models.Offer.findOne({ url: baseSlug, _id: { $ne: this._id } });

        if (existingOffer) {
            this.url = await generateUniqueSlug(this, baseSlug);
        } else {
            this.url = baseSlug;
        }
    }
    next();
});

module.exports = mongoose.model('Offer', OfferSchema);
