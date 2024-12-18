// const AppliedOffer = require('../model/AppliedOffer');
// const GeneratedCode = require('../model/GeneratedCodes');

// // Validate offer code
// exports.validateOfferCode = async (req, res) => {
//     try {
//         const { code, vendorId } = req.body;

//         if (!code || !vendorId) {
//             return res.status(200).json({
//                 status: "FAILED",
//                 message: "Offer code and vendor ID are required",
//                 error: 1,
//             });
//         }

//         // Find the generated code with the given code
//         const generatedCode = await GeneratedCode.findOne({ code });

//         if (!generatedCode) {
//             return res.status(200).json({
//                 status: "FAILED",
//                 message: "Invalid offer code",
//                 error: 1,
//             });
//         }

//         // Validate the status and expiration of the code
//         if (generatedCode.status !== 'active' || new Date() > new Date(generatedCode.valid_until)) {
//             return res.status(200).json({
//                 status: "FAILED",
//                 message: "Offer code is expired, inactive, or already used",
//                 error: 1,
//             });
//         }

//         // Update the status of the code to 'used'
//         generatedCode.status = 'used';
//         await generatedCode.save();

//         // Log the applied offer in the AppliedOffer collection
//         const appliedOffer = new AppliedOffer({
//             code,
//             offer: generatedCode.offer,
//             user: generatedCode.user,
//             vendor: vendorId,
//             status: 'used',
//         });

//         await appliedOffer.save();

//         // Respond with success
//         res.status(200).json({
//             status: "OK",
//             message: "Offer code applied successfully",
//             error: 0,
//         });
//     } catch (error) {
//         console.error("Error validating offer code:", error);
//         res.status(500).json({
//             status: "FAILED",
//             message: "Internal server error",
//             error: 1,
//         });
//     }
// };




const AppliedOffer = require('../model/AppliedOffer');
const GeneratedCode = require('../model/GeneratedCodes');
const Offer = require('../model/OffersModal');

// Validate offer code
exports.validateOfferCode = async (req, res) => {
    try {
        const { code, vendorId } = req.body;

        if (!code || !vendorId) {
            return res.status(200).json({
                status: "FAILED",
                message: "Offer code and vendor ID are required",
                error: 1,
            });
        }

        // Find the generated code with the given code
        const generatedCode = await GeneratedCode.findOne({ code });

        if (!generatedCode) {
            return res.status(200).json({
                status: "FAILED",
                message: "Invalid offer code",
                error: 1,
            });
        }

        // Find the related offer to get all its fields
        const offer = await Offer.findById(generatedCode.offer);

        if (!offer) {
            return res.status(200).json({
                status: "FAILED",
                message: "Related offer not found",
                error: 1,
            });
        }

        // Validate the status and expiration of the code
        if (generatedCode.status !== 'active' || new Date() > new Date(generatedCode.valid_until)) {
            return res.status(200).json({
                status: "FAILED",
                message: "Offer code is expired, inactive, or already used",
                error: 1,
            });
        }

        // Check if usage limit is reached for the generated code
        if (generatedCode.usage_limit <= 0) {
            return res.status(200).json({
                status: "FAILED",
                message: "Offer code has reached its usage limit",
                error: 1,
            });
        }

        // Check if the offer's global daily usage limit is exceeded
        if (offer.daily_limit <= 0) {
            return res.status(200).json({
                status: "FAILED",
                message: "Daily limit for this offer has been reached",
                error: 1,
            });
        }

        // Check daily application limit for the user
        const currentDate = new Date().setHours(0, 0, 0, 0); // Normalize to midnight for today
        const todayApplications = await AppliedOffer.countDocuments({
            offer: generatedCode.offer,
            user: generatedCode.user,
            createdAt: { $gte: currentDate },
        });

        if (todayApplications >= offer.daily_limit_per_user) { // Assuming you have a per-user daily limit
            return res.status(200).json({
                status: "FAILED",
                message: "User has reached the daily application limit for this offer",
                error: 1,
            });
        }

        // Update the status of the generated code to 'used' and decrease its usage limit
        generatedCode.status = 'used';

        await generatedCode.save();

        // Decrement the global daily limit for the offer
        offer.daily_limit -= 1;
        offer.usage_limit -= 1;
        offer.today_apply = (offer.today_apply || 0) + 1; // Increment today_apply count
        await offer.save();

        // Log the applied offer in the AppliedOffer collection
        const appliedOffer = new AppliedOffer({
            code,
            offer: generatedCode.offer,
            user: generatedCode.user,
            vendor: vendorId,
            status: 'used',
        });

        await appliedOffer.save();

        // Respond with success
        res.status(200).json({
            status: "OK",
            message: "Offer code applied successfully",
            error: 0,
            offer: offer, // Include the updated offer data in the response if needed
        });
    } catch (error) {
        console.error("Error validating offer code:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Internal server error",
            error: 1,
        });
    }
};
