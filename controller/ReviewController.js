
const Review = require("../model/ReviewModal");

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const userId = req.user?._id; // Extract user ID from the token

        if (!userId) {
            return res.status(401).json({
                status: "Failed",
                message: "User not authenticated",
                error: 1,
            });
        }

        // Include the user ID in the review document
        const reviewData = {
            ...req.body, // Take all fields dynamically from request body
            user: userId, // Add the extracted user ID
        };

        const review = new Review(reviewData);
        await review.save();

        res.status(201).json({
            status: "OK",
            message: "Review created successfully",
            data: review,
            error: 0,
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            error: 1,
        });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate({
                path: "user",
                select: "name email", // Select only the `name` and `email` fields from `user`
            })
            .populate("store"); // Populate `store` without restricting fields

        res.status(200).json({
            status: "OK",
            data: reviews,
            error: 0,
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            error: 1,
        });
    }
};


exports.getReviewsByStore = async (req, res) => {
    try {
        const { storeurl } = req.params;

        const reviews = await Review.aggregate([
            {
                $lookup: {
                    from: "stores", // Name of the stores collection
                    localField: "store",
                    foreignField: "_id",
                    as: "store",
                },
            },
            {
                $unwind: "$store", // Flatten the `store` array into an object
            },
            {
                $match: {
                    "store.url": storeurl, // Match the store URL
                },
            },
            {
                $lookup: {
                    from: "registers",
                    localField: "user",
                    foreignField: "_id",
                    as: "userdetails",
                },
            },
            {
                $unwind: {
                    path: "$userdetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: {
                    createdAt: -1, // Sort reviews by the `createdAt` field in descending order
                },
            },
        ]);

        res.status(200).json({
            status: "OK",
            data: reviews,
            error: 0,
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            error: 1,
        });
    }
};




// Update a review by ID
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id; // Ensure the user is authenticated

        if (!userId) {
            return res.status(401).json({
                status: "Failed",
                message: "User not authenticated",
                error: 1,
            });
        }

        const updatedReview = await Review.findOneAndUpdate(
            { _id: id, user: userId }, // Ensure the review belongs to the authenticated user
            req.body,
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({
                status: "Failed",
                message: "Review not found or you do not have permission to update it",
                error: 1,
            });
        }

        res.status(200).json({
            status: "OK",
            message: "Review updated successfully",
            data: updatedReview,
            error: 0,
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            error: 1,
        });
    }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await Review.findOneAndDelete({
            _id: id
        });

        if (!deletedReview) {
            return res.status(404).json({
                status: "Failed",
                message: "Review not found or you do not have permission to delete it",
                error: 1,
            });
        }

        res.status(200).json({
            status: "OK",
            message: "Review deleted successfully",
            error: 0,
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
            error: 1,
        });
    }
};
