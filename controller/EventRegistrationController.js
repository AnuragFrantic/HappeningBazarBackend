const EventRegistration = require("../model/EventRegistration")  // Assuming this is your model path

// Create a new event registration
exports.createRegistration = async (req, res) => {
    try {
        const newRegistration = new EventRegistration(req.body);  // Directly use req.body

        const savedRegistration = await newRegistration.save();
        return res.status(201).json({
            message: 'Registration successful',
            registration: savedRegistration,
            error: 0
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all registrations
exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await EventRegistration.find().populate('event user');
        return res.status(200).json({ message: "Event Registration Fetch Succesfully", data: registrations, error: 0 });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get a specific registration by ID
exports.getRegistrationById = async (req, res) => {
    try {
        const registration = await EventRegistration.findById(req.params.id).populate('event user');
        if (!registration) {
            return res.status(200).json({ message: 'Registration not found' });
        }
        return res.status(200).json(registration);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update a registration
exports.updateRegistration = async (req, res) => {
    try {
        const updatedRegistration = await EventRegistration.findByIdAndUpdate(
            req.params.id,
            req.body,  // Use req.body to update all fields dynamically
            { new: true }
        );

        if (!updatedRegistration) {
            return res.status(200).json({ message: 'Registration not found' });
        }

        return res.status(200).json({
            message: 'Registration updated successfully',
            registration: updatedRegistration
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete a registration
exports.deleteRegistration = async (req, res) => {
    try {
        const deletedRegistration = await EventRegistration.findByIdAndDelete(req.params.id);
        if (!deletedRegistration) {
            return res.status(200).json({ message: 'Registration not found', error: 1 });
        }

        return res.status(200).json({
            message: 'Registration deleted successfully',
            error: 0
        });
    } catch (error) {
        return res.status(500).json({ error: error.message, error: 1 });
    }
};
