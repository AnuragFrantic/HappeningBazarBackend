const Offer = require('../model/OffersModal');
const GeneratedCode = require('../model/GeneratedCodes'); // Import the GeneratedCode model

// Generate a new offer code
exports.generateOfferCode = async (req, res) => {
    try {
        const { user, offerId, vendor } = req.body;

        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({ status: "FAILED", message: "Offer not found", error: "1" });
        }

        // Generate a unique offer code
        const generatedCode = `OFFER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const validUntil = new Date();
        validUntil.setHours(23, 59, 59, 999); // Expire at 11:59 PM tonight

        // Create the generated code using the schema
        const newCode = new GeneratedCode({
            code: generatedCode,
            user,
            vendor,
            valid_until: validUntil,
            status: 'active',
        });

        // Add the generated code to the offer
        offer.generated_codes.push(newCode);
        await offer.save();

        // Send the response with the new code ID and details
        res.status(200).json({
            status: "OK",
            message: "Offer code generated successfully",
            error: "0",
            code: generatedCode,
            validUntil,
            id: newCode._id, // Send the newly generated ID
        });
    } catch (error) {
        console.error("Error generating offer code:", error);
        res.status(500).json({ status: "FAILED", message: "Error generating offer code", error: "1" });
    }
};
