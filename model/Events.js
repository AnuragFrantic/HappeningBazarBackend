const mongoose = require('mongoose')


const EventSchema = new mongoose.Schema({
    image: { type: String },
    title: { type: String },
    date: { type: String },
    short_detail: { type: String },
    detail: { type: String },
    // time: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, require: true }
}, {
    timestamps: true
})


module.exports = mongoose.model('Event', EventSchema)
