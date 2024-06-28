const mongoose = require('mongoose')

const ReportMerchant = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "Register" },
    reason: { type: String }
}, {
    timestamps: true
})


module.exports = mongoose.model("Report", ReportMerchant)