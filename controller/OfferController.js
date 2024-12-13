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
        res.status(201).json({ status: "OK", message: "Offer created successfully", error: 0 });
    } catch (error) {
        console.error("Error creating offer:", error);
        res.status(500).json({ status: "FAILED", message: "Offer not created", error: 1 });
    }
};

// Get all offers

exports.getAllOffers = async (req, res) => {
    try {
        const { state, city, alluser, category } = req.query;

        // Construct the filter based on the value of alluser
        const filter = {
            expiry_date: { $gte: new Date() },
        };

        // Add the conditions for `alluser` based on its value
        if (alluser === 'alluser') {
            // If `alluser` is 'alluser', show all data regardless of user type
            filter.alluser = 'alluser';
        } else if (alluser === 'utsav') {
            // If `alluser` is 'utsav', show data relevant to 'utsav' users
            filter.alluser = 'utsav';
        } else if (alluser === 'all') {
            // If `alluser` is 'all', show all data
            // No need to modify filter for this case
        }

        // Add additional filters for state and city if provided
        if (state) {
            filter.state = state;
        }
        if (city) {
            filter.city = city;
        }

        if (category) {
            filter.category = category;
        }

        // Find offers based on the constructed filter
        const data = await Offer.find(filter)
            .populate([
                {
                    path: 'generated_codes.user',
                    select: 'name email',
                },
                {
                    path: 'category',
                    select: '_id name position url'
                }
            ]);

        res.status(200).json({
            status: "OK",
            message: "Offers fetched successfully",
            error: 0,
            data
        });
    } catch (error) {
        console.error("Error fetching offers:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Error fetching offers",
            error: 1
        });
    }
};












// Update an existing offer
exports.updateOffer = async (req, res) => {
    const { id, ...updatedData } = req.body;

    if (!id) {
        return res.status(200).json({ status: "FAILED", message: "Offer ID is required", error: 1 });
    }

    try {
        if (req.file) {
            updatedData.image = req.file.path;
        }

        const updatedOffer = await Offer.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedOffer) {
            return res.status(404).json({ status: "FAILED", message: "Offer not found", error: 1 });
        }

        res.status(200).json({ status: "OK", message: "Offer updated successfully", error: 0, data: updatedOffer });
    } catch (error) {
        console.error("Error updating offer:", error);
        res.status(500).json({ status: "FAILED", message: "Error updating offer", error: 1 });
    }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(200).json({ status: "FAILED", message: "Offer ID is required", error: 1 });
    }

    try {
        const deletedOffer = await Offer.findByIdAndDelete(id);

        if (!deletedOffer) {
            return res.status(404).json({ status: "FAILED", message: "Offer not found", error: 1 });
        }

        res.status(200).json({ status: "OK", message: "Offer deleted successfully", error: 0 });
    } catch (error) {
        console.error("Error deleting offer:", error);
        res.status(500).json({ status: "FAILED", message: "Error deleting offer", error: 1 });
    }
};

// Get user-specific offers
// exports.getUserOffers = async (req, res) => {
//     try {
//         const { id } = req.query;

//         if (!id) {
//             return res.status(200).json({ status: "FAILED", message: "User ID is required", error: 1 });
//         }

//         const data = await Offer.find({ created_by: id }).populate("generated_codes");



//         res.status(200).json({ status: "OK", message: "Offers fetched successfully", error: 0, data });
//     } catch (error) {
//         console.error("Error fetching user offers:", error);
//         res.status(500).json({ status: "FAILED", message: "Error fetching offers", error: 1 });
//     }
// };



exports.getUserOffers = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(200).json({ status: "FAILED", message: "User ID is required", error: 1 });
        }

        const offers = await Offer.find({ created_by: id }).populate("generated_codes");

        // Filter out non-active generated_codes
        const filteredOffers = offers.map((offer) => {
            const activeCodes = offer.generated_codes.filter((code) => code.status === "active");
            return {
                ...offer.toObject(),
                generated_codes: activeCodes,
            };
        });

        res.status(200).json({ status: "OK", message: "Offers fetched successfully", error: 0, data: filteredOffers });
    } catch (error) {
        console.error("Error fetching user offers:", error);
        res.status(500).json({ status: "FAILED", message: "Error fetching offers", error: 1 });
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
            return res.status(404).json({ status: "FAILED", message: "No Offer found for the given URL", error: 1 });
        }

        res.status(200).json({ status: "OK", message: "Offer fetched successfully", error: 0, data: offerData });
    } catch (error) {
        console.error("Error fetching offer by URL:", error);
        res.status(500).json({ status: "FAILED", message: "Error fetching offer", error: 1 });
    }
};




