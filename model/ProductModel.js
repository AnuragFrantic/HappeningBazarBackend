const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(({
    name: { type: String },
    image: { type: String },
    detail: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, require: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true }
}), {
    timestamps: true
})

module.exports = mongoose.model('Product', ProductSchema)
