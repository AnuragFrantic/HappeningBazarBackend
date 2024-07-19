const Offer = require('../model/OffersModal')


exports.createoffer = async (req, res) => {
    try {
        const data = await Offer(req.body);
        console.log(data)
        await data.save()
        res.status(201).json({ status: "OK", message: "Offer  created Successfully", error: "0" });
    } catch (e) {
        res.status(500).json({ status: "OK", message: "Offer Not created", error: "1" });
    }
}


exports.getalloffer = async (req, res) => {
    try {
        const data = await Offer.find()
        res.status(200).json({ status: "OK", message: "Offer  Fetch Successfully", error: "0", data });

    } catch (e) {
        res.status(500).json({ status: "OK", message: "Offer Not Found", error: "1" });
    }
}



exports.putoffer = async (req, res) => {
    const { id, ...updatedData } = req.body;


    if (!id) {
        return res.status(400).send({ message: 'User ID is required' });
    }

    try {
        const updatedUser = await Offer.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found', error: "1" });
        }

        res.status(200).json({ status: "OK", message: "Offer  Updated Successfully", error: "0", updatedUser });
    } catch (error) {
        console.error(error);

        res.status(500).json({ status: "OK", message: "An error occurred while updating the user", error: "1" });
    }
};


exports.deleteoffer = async (req, res) => {
    const { id } = req.body
    console.log(id)
    if (id) {
        const data = await Offer.findByIdAndDelete(id)
        res.status(200).json({ status: "OK", message: "Offer  deleted Successfully", error: "0" });
    } else {
        res.status(500).json({ status: "OK", message: "Offer  not  found", error: "1" });
    }
}



exports.getOfferByUrl = async (req, res) => {
    try {
        const url = req.params.url;
        const offerdata = await Offer.aggregate([
            {
                $lookup: {
                    from: 'stores',
                    localField: 'store',
                    foreignField: '_id',
                    as: 'storeDetails'
                }
            },
            {
                $unwind: {
                    path: '$storeDetails',
                    preserveNullAndEmptyArrays: true // to include documents without storeDetails
                }
            },
            {
                $match: { "storeDetails.url": url }
            }
        ]);

        if (offerdata.length === 0) {
            return res.status(404).json({ message: 'No Offer found for the given URL' });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            data: offerdata,
            error: 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};






