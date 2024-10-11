const Membership = require('../model/Membership');

// CREATE Membership
exports.createmembership = async (req, res) => {
    try {
        const data = req.body;

        if (req.file) {
            data.image = req.file.path;
        }

        // if (Array.isArray(data.detail)) {
        //     data.detail = data.detail.map(detail => ({
        //         title: detail.title
        //     }));
        // } else {
        //     return res.status(400).json({ message: "Details must be an array of objects" });
        // }

        // Create the membership document in the database
        const newMembership = new Membership(data);
        await newMembership.save();

        // Send success response
        res.status(201).json({
            message: "Membership created successfully",
            data: newMembership,
            error: 0
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error creating membership",
            error: err.message
        });
    }
};

// GET ALL Memberships
exports.getallmembership = async (req, res) => {
    try {
        const data = await Membership.find();
        res.status(200).json({
            message: "Memberships fetched successfully",
            data: data,
            error: 0
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching memberships",
            error: err.message
        });
    }
};

// GET Membership by ID
exports.getmembershipbyid = async (req, res) => {
    try {
        const { id } = req.params;
        const membership = await Membership.findById(id);

        if (!membership) {
            return res.status(404).json({
                message: "Membership not found",
                error: 1
            });
        }

        res.status(200).json({
            message: "Membership fetched successfully",
            data: membership,
            error: 0
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching membership",
            error: err.message
        });
    }
};

// UPDATE Membership by ID
exports.updatemembership = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (req.file) {
            data.image = req.file.path;
        }

        // if (Array.isArray(data.detail)) {
        //     data.detail = data.detail.map(detail => ({
        //         title: detail.title
        //     }));
        // } else {
        //     return res.status(400).json({ message: "Details must be an array of objects" });
        // }

        const updatedMembership = await Membership.findByIdAndUpdate(id, data, { new: true });

        if (!updatedMembership) {
            return res.status(404).json({
                message: "Membership not found",
                error: 1
            });
        }

        res.status(200).json({
            message: "Membership updated successfully",
            data: updatedMembership,
            error: 0
        });
    } catch (err) {
        res.status(500).json({
            message: "Error updating membership",
            error: err.message
        });
    }
};

// DELETE Membership by ID
exports.deletemembership = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMembership = await Membership.findByIdAndDelete(id);

        if (!deletedMembership) {
            return res.status(404).json({
                message: "Membership not found",
                error: 1
            });
        }

        res.status(200).json({
            message: "Membership deleted successfully",
            data: deletedMembership,
            error: 0
        });
    } catch (err) {
        res.status(500).json({
            message: "Error deleting membership",
            error: err.message
        });
    }
};
