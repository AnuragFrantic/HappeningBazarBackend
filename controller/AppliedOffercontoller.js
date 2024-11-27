const AppliedOffer = require('../model/AppliedOffer');
const Offer = require('../model/OffersModal');

// Validate offer code
exports.validateOfferCode = async (req, res) => {
    try {
        const { code, vendorId } = req.body;

        if (!code || !vendorId) {
            return res.status(200).json({
                status: "FAILED",
                message: "Offer code and vendor ID are required",
                error: "1",
            });
        }

        // Find the offer containing the provided code
        const offer = await Offer.findOne({ 'generated_codes.code': code });

        if (!offer) {
            return res.status(404).json({
                status: "FAILED",
                message: "Invalid offer code",
                error: "1",
            });
        }

        // Find the specific generated code in the offer
        const generatedCode = offer.generated_codes.find(c => c.code === code);

        // Validate the status and expiration of the code
        if (!generatedCode || generatedCode.status !== 'active' || new Date() > new Date(generatedCode.valid_until)) {
            return res.status(200).json({
                status: "FAILED",
                message: "Offer code is expired, inactive, or already used",
                error: "1",
            });
        }

        // Update the status of the code to 'used'
        generatedCode.status = 'used';
        await offer.save();

        // Log the applied offer in the AppliedOffer collection
        const appliedOffer = new AppliedOffer({
            code,
            offer: offer._id,
            user: generatedCode.user,
            vendor: vendorId,
            status: 'used',
        });

        await appliedOffer.save();

        // Respond with success
        res.status(200).json({
            status: "OK",
            message: "Offer code applied successfully",
            error: "0",
        });
    } catch (error) {
        console.error("Error validating offer code:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Internal server error",
            error: "1",
        });
    }
};
