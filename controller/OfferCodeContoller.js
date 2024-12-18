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
            return res.status(200).json({
                status: "FAILED",
                message: "Offer not found",
                error: 1,
            });
        }

        // Check if the offer's usage or daily limit is exhausted
        if (offer.usage_limit <= 0) {
            return res.status(200).json({
                status: "FAILED",
                message: "Offer usage limit has been reached",
                error: 1,
            });
        }

        if (offer.daily_limit <= 0) {
            return res.status(200).json({
                status: "FAILED",
                message: "Offer daily limit has been reached",
                error: 1,
            });
        }

        // Get today's start and end time
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Check if a code was already generated for this user and offer today
        const existingCode = await GeneratedCode.findOne({
            user,
            offer: offerId,
            vendor,
            createdAt: { $gte: todayStart, $lte: todayEnd }, // Match today's date range
        });

        if (existingCode) {
            return res.status(200).json({
                status: "FAILED",
                message: "Offer code already generated for today",
                error: 1,
                code: existingCode.code,
                validUntil: existingCode.valid_until,
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

        // Decrement the usage and daily limits
        offer.usage_limit -= 1;
        offer.daily_limit -= 1;

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




exports.getAllGeneratedCode = async (req, res) => {
    try {
        const { status, user } = req.query;

        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (user) {
            filter.vendor = user;
        }

        // Fetch codes based on the filter
        const codes = await GeneratedCode.find(filter).populate([
            {
                path: 'user',
                select: 'name email',
            },
            {
                path: 'offer',
                select: 'name usage_limit start_date expiry_date is_active _id image',
            },
            {
                path: 'vendor',
                select: 'name email mobile',
            },
        ]);

        const currentDate = new Date();
        for (const code of codes) {
            if (new Date(code.valid_until) < currentDate && code.status !== "expired") {
                // Update status to expired
                code.status = "expired";
                await code.save();
            }
        }


        const updatedCodes = await GeneratedCode.find(filter).populate([
            {
                path: 'user',
                select: 'name email',
            },
            {
                path: 'offer',
                select: 'name usage_limit start_date expiry_date is_active _id image',
            },
            {
                path: 'vendor',
                select: 'name email mobile',
            },
        ]);

        res.status(200).json({
            status: "OK",
            message: `Generated codes fetched successfully${status ? ` with status ${status}` : ""}${user ? ` for user ${user}` : ""} and updated expired statuses`,
            error: 0,
            data: updatedCodes,
        });
    } catch (error) {
        console.error("Error fetching or updating generated codes:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Error fetching or updating generated codes",
            error: 1,
        });
    }
};











