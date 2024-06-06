const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({

    image: [{ type: String, required: true }],
    position: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Banner", BannerSchema);








