const Offer = require('../model/OffersModal');

// Create a new offer
exports.createOffer = async (req, res) => {
    try {
        const data = new Offer(req.body);

        // Handle uploaded file for image
        if (req.file) {
            data.image = req.file.path;
        }

        await data.save();
        res.status(201).json({ status: "OK", message: "Offer created successfully", error: "0" });
    } catch (error) {
        console.error("Error creating offer:", error);
        res.status(500).json({ status: "FAILED", message: "Offer not created", error: "1" });
    }
};

// Get all offers
exports.getAllOffers = async (req, res) => {
    try {
        const { state, city } = req.query;

        const filter = {
            alluser: true,
            expiry_date: { $gte: new Date() },
            ...(state && { state }),
            ...(city && { city }),
        };

        const data = await Offer.find(filter).populate({
            path: 'generated_codes.user',
            select: 'name email',
        });

        res.status(200).json({ status: "OK", message: "Offers fetched successfully", error: "0", data });
    } catch (error) {
        console.error("Error fetching offers:", error);
        res.status(500).json({ status: "FAILED", message: "Error fetching offers", error: "1" });
    }
};

// Update an existing offer
exports.updateOffer = async (req, res) => {
    const { id, ...updatedData } = req.body;

    if (!id) {
        return res.status(200).json({ status: "FAILED", message: "Offer ID is required", error: "1" });
    }

    try {
        if (req.file) {
            updatedData.image = req.file.path;
        }

        const updatedOffer = await Offer.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedOffer) {
            return res.status(404).json({ status: "FAILED", message: "Offer not found", error: "1" });
        }

        res.status(200).json({ status: "OK", message: "Offer updated successfully", error: "0", data: updatedOffer });
    } catch (error) {
        console.error("Error updating offer:", error);
        res.status(500).json({ status: "FAILED", message: "Error updating offer", error: "1" });
    }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(200).json({ status: "FAILED", message: "Offer ID is required", error: "1" });
    }

    try {
        const deletedOffer = await Offer.findByIdAndDelete(id);

        if (!deletedOffer) {
            return res.status(404).json({ status: "FAILED", message: "Offer not found", error: "1" });
        }

        res.status(200).json({ status: "OK", message: "Offer deleted successfully", error: "0" });
    } catch (error) {
        console.error("Error deleting offer:", error);
        res.status(500).json({ status: "FAILED", message: "Error deleting offer", error: "1" });
    }
};

// Get user-specific offers
exports.getUserOffers = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(200).json({ status: "FAILED", message: "User ID is required", error: "1" });
        }

        const data = await Offer.find({ created_by: id }).populate({
            path: 'generated_codes.user',
            select: 'name email address',
        });

        res.status(200).json({ status: "OK", message: "Offers fetched successfully", error: "0", data });
    } catch (error) {
        console.error("Error fetching user offers:", error);
        res.status(500).json({ status: "FAILED", message: "Error fetching offers", error: "1" });
    }
};

// Get offer by URL
exports.getOfferByUrl = async (req, res) => {
    try {
        const { url } = req.params;

        const offerData = await Offer.aggregate([
            { $match: { url } },
            {
                $lookup: {
                    from: 'stores',
                    localField: 'store',
                    foreignField: '_id',
                    as: 'storeDetails',
                },
            },
            { $unwind: { path: '$storeDetails', preserveNullAndEmptyArrays: true } },
        ]);

        if (!offerData.length) {
            return res.status(404).json({ status: "FAILED", message: "No Offer found for the given URL", error: "1" });
        }

        res.status(200).json({ status: "OK", message: "Offer fetched successfully", error: "0", data: offerData });
    } catch (error) {
        console.error("Error fetching offer by URL:", error);
        res.status(500).json({ status: "FAILED", message: "Error fetching offer", error: "1" });
    }
};




