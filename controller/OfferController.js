const Offer = require('../model/OffersModal');

// Create a new offer
exports.createoffer = async (req, res) => {
    try {
        const data = new Offer(req.body); // Use `new` to instantiate the offer

        // If there's an uploaded file, set the image path
        if (req.file) {
            data.image = req.file.path;
        }

        await data.save();

        res.status(201).json({ status: "OK", message: "Offer created successfully", error: "0" });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ status: "FAILED", message: "Offer not created", error: "1" });
    }
};

// Fetch all offers with optional filtering by state and city
exports.getalloffer = async (req, res) => {
    try {
        const { state, city } = req.query;

        // Build a filter object
        const filter = {};
        if (state) filter.state = state;
        if (city) filter.city = city;

        // Fetch offers based on the filter
        const data = await Offer.find(filter).populate({
            path: 'generated_codes.user',
            select: 'name email'
        })

        res.status(200).json({ status: "OK", message: "Offers fetched successfully", error: "0", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", message: "Error fetching offers", error: "1" });
    }
};

// Update an existing offer
exports.putoffer = async (req, res) => {
    const { id, ...updatedData } = req.body;

    if (!id) {
        return res.status(400).json({ status: "FAILED", message: 'Offer ID is required', error: "1" });
    }

    try {
        // If a new image is uploaded, update the image field
        if (req.file) {
            updatedData.image = req.file.path;
        }

        // Find and update the offer
        const updatedOffer = await Offer.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedOffer) {
            return res.status(404).json({ status: "FAILED", message: 'Offer not found', error: "1" });
        }

        res.status(200).json({ status: "OK", message: "Offer updated successfully", error: "0", data: updatedOffer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", message: "An error occurred while updating the offer", error: "1" });
    }
};

// Delete an offer by its ID
exports.deleteoffer = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ status: "FAILED", message: "Offer ID is required", error: "1" });
    }

    try {
        const data = await Offer.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({ status: "FAILED", message: "Offer not found", error: "1" });
        }

        res.status(200).json({ status: "OK", message: "Offer deleted successfully", error: "0" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", message: "An error occurred while deleting the offer", error: "1" });
    }
};

// Fetch offers created by a specific user
exports.getuseroffer = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ status: "FAILED", message: "User ID is required", error: "1" });
        }

        const data = await Offer.find({ created_by: id }).populate({
            path: 'generated_codes.user',
            select: 'name email address'
        });

        res.status(200).json({ status: "OK", message: "Offers fetched successfully", error: "0", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", message: "Error fetching offers", error: "1" });
    }
};

// Fetch offer details by URL
exports.getOfferByUrl = async (req, res) => {
    try {
        const { url } = req.params;

        // Fetch offer details along with the related store details
        const offerData = await Offer.aggregate([
            { $match: { url } },
            {
                $lookup: {
                    from: 'stores', // Lookup related store details
                    localField: 'store',
                    foreignField: '_id',
                    as: 'storeDetails'
                }
            },
            {
                $unwind: {
                    path: '$storeDetails',
                    preserveNullAndEmptyArrays: true // Include offers even if no store details are found
                }
            }
        ]);

        if (!offerData.length) {
            return res.status(404).json({ status: "FAILED", message: 'No Offer found for the given URL', error: "1" });
        }

        res.status(200).json({
            status: "OK",
            message: "Offer fetched successfully",
            error: "0",
            data: offerData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", message: 'Server error', error: "1" });
    }
};

// Generate a new offer code for a user
exports.generateOfferCode = async (req, res) => {
    try {
        const { user, offerId, vendor } = req.body;
        console.log(req.body)

        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({ status: "FAILED", message: 'Offer not found', error: "1" });
        }

        // Generate a unique offer code
        const generatedCode = `OFFER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const validUntil = new Date();
        validUntil.setHours(23, 59, 59, 999); // Expire at 11:59 PM tonight

        // Save the generated code to the offer
        offer.generated_codes.push({
            code: generatedCode,
            user: user,
            vendor: vendor,
            valid_until: validUntil,
            status: 'active'
        });

        await offer.save();

        res.status(200).json({ status: "OK", message: "Offer code generated successfully", error: "0", code: generatedCode, validUntil });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", message: 'Internal server error', error: "1" });
    }
};
