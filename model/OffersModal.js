
const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const OfferSchema = new mongoose.Schema({
    // Existing fields
    name: { type: String, required: true },
    description: { type: String, required: true },
    deleted_price: { type: Number },
    real_price: { type: Number },
    membership: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
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
    discount_amount: { type: Number },
    discount_percentage: { type: String },
    minimum_purchase: { type: Number },
    maximum_discount: { type: Number },
    usage_limit: { type: Number, default: 1 },
    start_date: { type: Date },
    expiry_date: { type: Date },
    state: { type: String },
    city: { type: String },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    url: {
        type: String,
        unique: true,
        required: true
    },
    // New fields for tracking codes
    generated_codes: [
        {
            code: { type: String, sparse: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: "Register" },
            vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Register" },
            valid_until: { type: Date },
            status: { type: String, enum: ["active", "used", "expired"], default: "active" }
        }
    ]
}, { timestamps: true });



OfferSchema.pre('save', function (next) {
    if (this.isNew) {
        // If generated_codes is not provided, initialize it to an empty array
        if (!this.generated_codes) {
            this.generated_codes = [];
        }
    }
    next();
});

async function generateUniqueSlug(instance, baseSlug, counter = 1) {
    const newSlug = `${baseSlug}-${counter}`;

    const existing = await mongoose.models.Offer.findOne({ url: newSlug });

    if (existing) {
        return generateUniqueSlug(instance, baseSlug, counter + 1);
    }

    return newSlug;
}

// Middleware to generate slug before saving
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

