const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
    name: { type: String, required: true },  // Name should be required for registration
    email: { type: String, required: true },  // Email should be required
    phone: { type: String, required: true },  // Phone should be required
    address: { type: String },
    status: { type: String, default: "pending" },
}, {
    timestamps: true
});

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
module.exports = EventRegistration;
