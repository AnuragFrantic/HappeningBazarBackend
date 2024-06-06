const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(({
    name: { type: String },
    image: { type: String },
    detail: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, require: true }
}), {
    timestamps: true
})

module.exports = mongoose.model('Product', ProductSchema)