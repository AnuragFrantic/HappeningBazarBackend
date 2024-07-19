const mongoose = require("mongoose")


const CategoriesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    url: { type: String },

}, {
    timestamps: true

})


module.exports = new mongoose.model("Category", CategoriesSchema)