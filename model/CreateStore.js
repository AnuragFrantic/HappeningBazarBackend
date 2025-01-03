const mongoose = require("mongoose");
const slugify = require('slugify');

const StoreSchema = new mongoose.Schema({
    title: { type: String },
    desc: { type: String },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    description: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Description' }],
    state: { type: String },
    city: { type: String },
    sector: { type: String },
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    url: {
        type: String,
        unique: true,
        required: true
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },

}, {
    timestamps: true
})



StoreSchema.pre('validate', function (next) {
    if (this.title) {
        this.url = slugify(this.title, { lower: true, remove: /[*+~.()'"!:@/]/g });
    }
    next();
});

module.exports = mongoose.model("Store", StoreSchema);