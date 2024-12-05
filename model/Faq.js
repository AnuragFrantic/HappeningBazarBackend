const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,

        trim: true
    },
    answer: {
        type: String,

        trim: true
    },
    category: {
        type: String,
        required: false,
        trim: true
    },
    tags: {
        type: [String],
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the updated_at field before saving
faqSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;
