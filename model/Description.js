const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    img: { type: String, required: true }
});

const DescriptionSchema = new mongoose.Schema({
    store_name: { type: String },
    image: [ImageSchema],
    short_detail: { type: String },
    detail: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },

}, {
    timestamps: true
});




module.exports = mongoose.model("Description", DescriptionSchema);

