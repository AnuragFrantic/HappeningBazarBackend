const Offer = require('../model/OffersModal');
const GeneratedCode = require('../model/GeneratedCodes'); // Import the GeneratedCode model

// Generate a new offer code
exports.generateOfferCode = async (req, res) => {
    try {
        const { user, offerId, vendor } = req.body;

        // Validate input data
        if (!user || !offerId || !vendor) {
            return res.status(400).json({
                status: "FAILED",
                message: "User, offerId, and vendor are required",
                error: 1,
            });
        }

        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({
                status: "FAILED",
                message: "Offer not found",
                error: 1,
            });
        }

        // Generate a unique offer code
        const generatedCode = `OFFER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const validUntil = new Date();
        validUntil.setHours(23, 59, 59, 999); // Expire at 11:59 PM tonight

        // Create and save the generated code
        const newCode = await GeneratedCode.create({
            code: generatedCode,
            user,
            vendor,
            valid_until: validUntil,
            status: 'active',
            offer: offerId, // Reference back to the offer
        });

        // Add the generated code ID to the offer's generated_codes array
        offer.generated_codes.push(newCode._id);
        await offer.save();

        // Send the response with the new code details
        res.status(200).json({
            status: "OK",
            message: "Offer code generated successfully",
            error: 0,
            code: generatedCode,
            validUntil,
            id: newCode._id, // Send the newly generated code ID
        });
    } catch (error) {
        console.error("Error generating offer code:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Error generating offer code",
            error: 1,
        });
    }
};
