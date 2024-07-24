const mongoose = require("mongoose");

const OpenHourSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },

    monday: {
        type: String,
        default: "closed"
    },
    tuesday: {
        type: String,
        default: "closed"
    },
    wednesday: {
        type: String,
        default: "closed"
    },
    thursday: {
        type: String,
        default: "closed"
    },
    friday: {
        type: String,
        default: "closed"
    },
    saturday: {
        type: String,
        default: "closed"
    },
    sunday: {
        type: String,
        default: "closed"
    }
});

const OpenHour = mongoose.model('OpenHour', OpenHourSchema);

module.exports = OpenHour;
