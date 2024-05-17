const mongoose = require("mongoose")


const SubCategorySchema = new mongoose.Schema({
    title: { type: String },
    image: { type: String },
    type: { type: String },
    status: { type: String },
    review: { type: String },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }

})

module.exports = mongoose.model("SubCategory", SubCategorySchema)