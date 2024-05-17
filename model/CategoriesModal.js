const mongoose = require("mongoose")


const CategoriesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
})


module.exports = new mongoose.model("Category", CategoriesSchema)