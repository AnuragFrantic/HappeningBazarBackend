const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
    state: { type: String, required: false },
    city: { type: String, required: false },
    address: { type: String, required: false },
    pincode: { type: String, required: false }
}, {
    timestamps: true
})

module.exports = mongoose.model('Location', LocationSchema);