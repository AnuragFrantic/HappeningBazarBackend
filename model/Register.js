const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    state: { type: String, required: false },
    password: { type: String, required: true },
    city: { type: String, required: false },
    pincode: { type: String, required: false },
    fulladdress: { type: String, required: false },
    gst: { type: String, required: false },
    lat: { type: String },
    long: { type: String },
    image: { type: String },
    type: { type: String, enum: ["User", "Vendor", "Admin"], required: true },
    status: {
        type: String,
        enum: ['pending', 'cancelled', 'accepted']
    },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    description: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Description' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Register', RegisterSchema);