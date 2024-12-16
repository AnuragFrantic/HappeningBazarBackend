const OpenHour = require('../model/OpenHour'); // Adjust the path as necessary

// Create a new OpenHour
exports.createOpenHour = async (req, res) => {
    try {
        const newOpenHour = new OpenHour(req.body);
        const savedOpenHour = await newOpenHour.save();
        res.status(201).json({ error: 0, data: savedOpenHour });
    } catch (error) {
        res.status(500).json({ error: 1, message: error.message });
    }
};



// Get a single OpenHour by ID
exports.getOpenHourById = async (req, res) => {
    try {
        const openHour = await OpenHour.findById(req.params.id).populate('store');
        if (!openHour) {
            return res.status(500).json({ error: 1, message: 'OpenHour not found' });
        }
        res.status(200).json({ error: 0, data: openHour });
    } catch (error) {
        res.status(500).json({ error: 1, message: error.message });
    }
};


exports.getOpenHours = async (req, res) => {
    try {
        const { storeUrl } = req.query; // Capture store URL from query params
        let query = {};

        if (storeUrl) {
            query = { 'store.url': storeUrl }; // Filter based on store URL
        }

        // Find OpenHours and populate related store details
        const openHours = await OpenHour.find(query).populate({
            path: 'store',
            match: storeUrl ? { url: storeUrl } : {}, // Match the store URL if provided
        });

        // Filter out any OpenHour entries without matching stores (if storeUrl is provided)
        const filteredOpenHours = openHours.filter((openHour) => openHour.store);

        res.status(200).json({ error: 0, data: filteredOpenHours });
    } catch (error) {
        res.status(500).json({ error: 1, message: error.message });
    }
};

// Update an OpenHour by ID
exports.updateOpenHour = async (req, res) => {
    try {
        const updatedOpenHour = await OpenHour.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('store');
        if (!updatedOpenHour) {
            return res.status(500).json({ error: 1, message: 'OpenHour not found' });
        }
        res.status(200).json({ error: 0, data: updatedOpenHour });
    } catch (error) {
        res.status(500).json({ error: 1, message: error.message });
    }
};

// Delete an OpenHour by ID
exports.deleteOpenHour = async (req, res) => {
    try {
        const deletedOpenHour = await OpenHour.findByIdAndDelete(req.params.id);
        if (!deletedOpenHour) {
            return res.status(500).json({ error: 1, message: 'OpenHour not found' });
        }
        res.status(200).json({ error: 0, message: 'OpenHour deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 1, message: error.message });
    }
};


