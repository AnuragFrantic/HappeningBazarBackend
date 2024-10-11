const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: { type: String },
    image: { type: String },
    // detail: [{
    //     title: { type: String }
    // }],
    description: { type: String },
    amount: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Membership', MemberSchema);
