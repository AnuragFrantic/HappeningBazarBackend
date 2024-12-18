const FAQ = require('../model/Faq'); // Adjust the path according to your project structure

// Create a new FAQ entry
exports.createFAQ = async (req, res) => {
    try {
        const newFAQ = new FAQ({
            question: req.body.question,
            answer: req.body.answer,
            category: req.body.category,
            tags: req.body.tags
        });
        const savedFAQ = await newFAQ.save();
        res.status(201).json({ status: 'Success', message: 'FAQ created successfully', error: 0, data: savedFAQ });
    } catch (error) {
        res.status(500).json({ status: 'Failed', message: error.message, error: 1 });
    }
};

// Get all FAQ entries
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json({ status: 'Success', error: 0, data: faqs });
    } catch (error) {
        res.status(500).json({ status: 'Failed', message: error.message, error: 1 });
    }
};

// Get a single FAQ entry by ID
exports.getFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(200).json({ status: 'Failed', message: 'FAQ not found', error: 1 });
        }
        res.status(200).json({ status: 'Success', error: 0, data: faq });
    } catch (error) {
        res.status(500).json({ status: 'Failed', message: error.message, error: 1 });
    }
};

// Update an existing FAQ entry by ID
exports.updateFAQ = async (req, res) => {
    try {
        const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFAQ) {
            return res.status(200).json({ status: 'Failed', message: 'FAQ not found', error: 1 });
        }
        res.status(200).json({ status: 'Success', message: 'FAQ updated successfully', error: 0, data: updatedFAQ });
    } catch (error) {
        res.status(500).json({ status: 'Failed', message: error.message, error: 1 });
    }
};

// Delete an FAQ entry by ID
exports.deleteFAQ = async (req, res) => {
    try {
        const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
        if (!deletedFAQ) {
            return res.status(200).json({ status: 'Failed', message: 'FAQ not found', error: 1 });
        }
        res.status(200).json({ status: 'Success', message: 'FAQ deleted successfully', error: 0, data: deletedFAQ });
    } catch (error) {
        res.status(500).json({ status: 'Failed', message: error.message, error: 1 });
    }
};
