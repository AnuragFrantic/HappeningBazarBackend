const Offer = require('../model/OffersModal')


exports.createoffer = async (req, res) => {
    try {
        const data = await Offer(req.body);
        if (req.file) {
            data.image = req.file.path
        }

        await data.save()

        res.status(201).json({ status: "OK", message: "Offer  created Successfully", error: "0" });
    } catch (e) {

        res.status(500).json({ status: "OK", message: "Offer Not created", error: "1" });
    }
}


exports.getalloffer = async (req, res) => {
    try {
        const { state, city } = req.query;

        // Build a filter object
        let filter = {};


        if (state) {
            filter.state = state;
        }
        if (city) {
            filter.city = city;
        }

        // Fetch offers based on the filter
        const data = await Offer.find(filter);

        res.status(200).json({ status: "OK", message: "Offer Fetch Successfully", error: "0", data });
    } catch (e) {
        console.error(e);
        res.status(500).json({ status: "OK", message: "Offer Not Found", error: "1" });
    }
};






exports.putoffer = async (req, res) => {
    const { id, ...updatedData } = req.body;

    if (!id) {
        return res.status(400).send({ message: 'Offer ID is required' });
    }

    try {
        // If a new image is uploaded, update the image field
        if (req.file) {
            updatedData.image = req.file.path;
        }

        // Find and update the offer
        const updatedOffer = await Offer.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedOffer) {
            return res.status(404).send({ message: 'Offer not found', error: "1" });
        }

        res.status(200).json({ status: "OK", message: "Offer Updated Successfully", error: "0", updatedOffer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "OK", message: "An error occurred while updating the offer", error: "1" });
    }
};


exports.deleteoffer = async (req, res) => {
    const { id } = req.body

    if (id) {
        const data = await Offer.findByIdAndDelete(id)
        res.status(200).json({ status: "OK", message: "Offer  deleted Successfully", error: "0" });
    } else {
        res.status(500).json({ status: "OK", message: "Offer  not  found", error: "1" });
    }
}

exports.getuseroffer = async (req, res) => {
    try {
        const { id } = req.query;
        const data = await Offer.find({ 'created_by': id })
        res.status(201).json({ status: "OK", message: "Offer fecth successfully", error: "0", data: data });
    } catch (err) {
        res.status(500).json({ status: "OK", message: "Offer Not Found", error: "1" })
    }
}



exports.getOfferByUrl = async (req, res) => {
    try {
        const url = req.params.url;


        // Fetch offer details along with the related store details
        const offerdata = await Offer.aggregate([
            {
                $match: { url: url } // Match the offer's own URL field
            },
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
                    preserveNullAndEmptyArrays: true // Include offers even if no storeDetails
                }
            }
        ]);

        if (offerdata.length === 0) {
            return res.status(404).json({ message: 'No Offer found for the given URL', error: 1 });
        }

        res.status(200).json({
            message: "Offer fetched successfully",
            data: offerdata,
            error: 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: 1 });
    }
};







