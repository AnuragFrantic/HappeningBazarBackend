const AppliedOffer = require('../model/AppliedOffer');
const Offer = require('../model/OffersModal');


// Validate offer code
exports.validateOfferCode = async (req, res) => {
    try {
        const { code, vendorId } = req.body;

        const offer = await Offer.findOne({ 'generated_codes.code': code });

        if (!offer) {
            return res.status(404).json({ message: 'Invalid offer code' });
        }

        const generatedCode = offer.generated_codes.find(c => c.code === code);

        if (generatedCode.status !== 'active' || new Date() > new Date(generatedCode.valid_until)) {
            return res.status(400).json({ message: 'Offer code is expired or already used' });
        }


        generatedCode.status = 'used';
        await offer.save();

        // Log the applied offer
        const appliedOffer = new AppliedOffer({
            code,
            offer: offer._id,
            user: generatedCode.user,
            vendor: vendorId,
            status: 'used'
        });

        await appliedOffer.save();

        res.json({ message: 'Offer code applied successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
