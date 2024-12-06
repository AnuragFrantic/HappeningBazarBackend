const mongoose = require("mongoose");

const LeadModal = new mongoose.Schema({
    firstName: { type: String, },
    lastName: { type: String, },
    companyname:  {type :String},
    gst_no : {type :String},
    email: { type: String },
    phone: { type: String },
    country: { type: String },
    state: { type: String, required: false },
    city: { type: String, required: false },
    pincode: { type: String, required: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", },
    address1: { type: String },
    address2: { type: String },
    type: { type: String, enum: ["User", "Vendor"], },

    deleted_at: { type: String },

}, {
    timestamps: true
});

module.exports = mongoose.model('Lead', LeadModal);