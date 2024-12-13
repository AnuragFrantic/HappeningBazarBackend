const Policy = require('../model/Policy');
const slugify = require("slugify");

// Create or update policy based on the title
exports.createOrUpdatePolicy = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required.",
                error: 1
            });
        }

        
        const url = slugify(title, { lower: true, strict: true });

        
        let policy = await Policy.findOne({ url });

        if (policy) {
            // Update the existing policy
            policy.title = title;
            policy.description = description;
            policy = await policy.save();

            return res.status(200).json({
                message: "Policy updated successfully.",
                policy,
                error: 0
            });
        }

        // Create a new policy
        const newPolicy = new Policy({
            title,
            description,
            url
        });

        const savedPolicy = await newPolicy.save();
        return res.status(201).json({
            message: "Policy created successfully.",
            data: savedPolicy,
            error: 0
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            error: 1
        });
    }
};

// Get all policies
exports.getPolicies = async (req, res) => {
    try {
        const policies = await Policy.find();
        return res.status(200).json({
            message: "Policy Fetch successfully.",
            data: policies,
            error: 0
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            error: 1
        });
    }
};

// Get a single policy by URL
exports.getPolicyByUrl = async (req, res) => {
    try {
        const { url } = req.params;
        const policy = await Policy.findOne({ url });

        if (!policy) {
            return res.status(404).json({
                message: "Policy not found.",
                error: 1
            });
        }

        return res.status(200).json({
            data: policy,
            error: 0
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            error: 1
        });
    }
};

// Delete a policy by URL
exports.deletePolicy = async (req, res) => {
    try {
        const { url } = req.params;
        const policy = await Policy.findOneAndDelete({ url });

        if (!policy) {
            return res.status(404).json({
                message: "Policy not found.",
                error: 1
            });
        }

        return res.status(200).json({
            message: "Policy deleted successfully.",
            error: 0
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            error: 1
        });
    }
};
