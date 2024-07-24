const mongoose = require("mongoose");
const slugify = require('slugify');

const StoreSchema = new mongoose.Schema({
    title: { type: String },
    desc: { type: String },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    description: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Description' }],

    product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    url: {
        type: String,
        unique: true,
        required: true
    }
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