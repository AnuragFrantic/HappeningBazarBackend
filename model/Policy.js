const mongoose = require('mongoose')


const PolicySchema = new mongoose.Schema({
    url: { type: String },
    title: { type: String },
    description: { type: String }
}, { timestamps: true })



module.exports = mongoose.model('Policy', PolicySchema);
