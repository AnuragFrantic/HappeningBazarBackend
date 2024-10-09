const mongoose = require("mongoose");
const slugify = require('slugify');


const ImageSchema = new mongoose.Schema({
    img: { type: String, required: true }
});

const ProductSchema = new mongoose.Schema({
    name: { type: String },
    image: [ImageSchema],
    shortdetail: { type: String },
    detail: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    url: {
        type: String,
        unique: true,
        required: true
    },
}, {
    timestamps: true
});

// Function to generate unique slug
async function generateUniqueSlug(baseSlug, counter = 1) {
    const newSlug = `${baseSlug}-${counter}`;

    const existing = await mongoose.models.Product.findOne({ url: newSlug });

    if (existing) {
        return generateUniqueSlug(baseSlug, counter + 1);
    }

    return newSlug;
}

// Pre-validation hook to create URL slug
ProductSchema.pre('validate', async function (next) {
    if (this.name) {
        let baseSlug = slugify(this.name, { lower: true, remove: /[*+~.()'"!:@/]/g });

        const existingProduct = await mongoose.models.Product.findOne({ url: baseSlug, _id: { $ne: this._id } });

        if (existingProduct) {
            this.url = await generateUniqueSlug(baseSlug);
        } else {
            this.url = baseSlug;
        }
    }
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
