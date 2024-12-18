const Lead = require("../model/LeadModal"); // Adjust the path to your Lead model

// Create a new Lead
exports.createLead = async (req, res) => {
    try {
        const lead = await Lead.create(req.body);
        res.status(201).json({ success: true, data: lead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all Leads
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate("category");
        res.status(200).json({ success: true, data: leads });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single Lead by ID
exports.getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate("category");
        if (!lead) {
            return res.status(200).json({ success: false, message: "Lead not found" });
        }
        res.status(200).json({ success: true, data: lead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a Lead by ID
exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate("category");
        if (!lead) {
            return res.status(200).json({ success: false, message: "Lead not found" });
        }
        res.status(200).json({ success: true, data: lead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a Lead by ID
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(200).json({ success: false, message: "Lead not found" });
        }
        res.status(200).json({ success: true, message: "Lead deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
