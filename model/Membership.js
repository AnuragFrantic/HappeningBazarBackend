const mongoose = require('mongoose')



const MemberSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    amount: { type: String },
}, {
    timestamps: true
});



module.exports = mongoose.model('Membership', MemberSchema);