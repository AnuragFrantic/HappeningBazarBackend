const mongoose = require('mongoose')


const StateSchema = new mongoose.Schema({
    name: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("State", StateSchema)