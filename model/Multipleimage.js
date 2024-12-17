const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({

    image: [{ type: String, required: true }],
    position: { type: String },
    type: { type: String },
    title: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("Banner", BannerSchema);








