const DescriptionModal = require("../model/Description")
const UserModal = require('../model/Register')
const StoreModal = require("../model/CreateStore")

// exports.createdescription = async (req, res) => {
//     try {

//         const user = await UserModal.findById({ "_id": req.body.created_by });
//         const store = await StoreModal.findById({ "_id": req.body.store });
//         if (user.status == "cancelled" || user.status == "pending") {
//             res.status(200).send({ "status": "Failed", "message": `Your application is ${user.status}, which is why you cannot upload products.`, error: "1" });
//         } else if (!store) {
//             res.status(200).send({ "status": "Failed", "message": `Store Not Found`, error: "1" });
//         } else {
//             const images = req.files.map(file => ({ img: file.path }));

//             const newDescription = new DescriptionModal({
//                 ...req.body,
//                 image: images
//             });


//             await newDescription.save();
//             user.description.push(newDescription._id);
//             store.description.push(newDescription._id)
//             await user.save();
//             await store.save();
//             res.status(200).send({ "status": "OK", "message": "Description Created Successfully", error: 0, data: newDescription });
//         }

//     } catch (e) {
//         res.status(500).send({ "status": "Failed", "message": e.message, error: "1" });
//     }
// }

exports.createdescription = async (req, res) => {
    try {
        const user = await UserModal.findById(req.body.created_by);
        const store = await StoreModal.findById(req.body.store);

        if (!user) {
            return res.status(200).send({ "status": "Failed", "message": "User not found", error: "1" });
        }

        if (user.status === "cancelled" || user.status === "pending") {
            return res.status(200).send({ "status": "Failed", "message": `Your application is ${user.status}, which is why you cannot upload products.`, error: "1" });
        }

        if (!store) {
            return res.status(200).send({ "status": "Failed", "message": "Store not found", error: "1" });
        }

        // Check if the store already has an assigned description
        const existingDescription = await DescriptionModal.findOne({ store: store });

        if (existingDescription) {
            return res.status(200).send({ "status": "Failed", "message": "This store already has an assigned description", error: "1" });
        }

        // Create new description
        const images = req.files.map(file => ({ img: file.path }));

        const newDescription = new DescriptionModal({
            ...req.body,
            image: images
        });

        await newDescription.save();
        user.description.push(newDescription._id);
        store.description.push(newDescription._id);
        await user.save();
        await store.save();

        res.status(200).send({ "status": "OK", "message": "Description Created Successfully", error: 0, data: newDescription });

    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: "1" });
    }
};




exports.getalldescription = async (req, res) => {
    try {
        const data = await DescriptionModal.find()
            .populate({
                path: "created_by store",
                select: "_id name title url"
            })
            .sort({ createdAt: -1 });
        res.status(200).send({
            message: "Get Data Successfully",
            error: 0,
            data: data
        });
    } catch (e) {
        res.status(500).send({
            status: "Failed",
            message: e.message,
            error: 1
        });
    }
};





exports.deletedesc = async (req, res) => {
    try {
        const data = await DescriptionModal.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(500).send({ "status": "Failed", "message": "Description not found" });
        }
        res.status(200).send({ "status": "OK", "message": "Description deleted successfully", data: data, error: 0 });
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: 1 });
    }
}



exports.updatedescription = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const images = req.files.map(file => ({ img: file.path }));

        // Find the existing description by ID
        let description = await DescriptionModal.findById(id);

        // If the description doesn't exist, return a 500 error
        if (!description) {
            return res.status(500).send({ "status": "Failed", "message": "Description not found" });
        }

        // Update the existing fields
        description.store_name = data.store_name || description.store_name;
        description.detail = data.detail || description.detail;
        description.short_detail = data.short_detail || description.short_detail;

        // Append new images to the existing ones
        if (images.length > 0) {
            description.image = [...description.image, ...images];
        }

        // Save the updated description
        await description.save();

        // Send a success response
        res.status(200).send({ "status": "OK", "message": "Description updated successfully", data: description });
    } catch (e) {
        // Handle errors
        res.status(500).send({ "status": "Failed", "message": e.message });
    }
}







exports.getdescriptionbyurl = async (req, res) => {
    try {
        const url = req.params.url;

        const description = await DescriptionModal.aggregate([
            {
                $lookup: {
                    from: 'stores', // the name of the collection for the 'store' reference
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

        if (description.length === 0) {
            return res.status(500).json({ message: 'Description not found' });
        }

        res.status(200).json({
            message: "Description fetched successfully",
            data: description[0],
            error: 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};










exports.deleteImage = async (req, res) => {
    try {
        const { imageId } = req.params;

        // Find the description containing the image to delete
        const description = await DescriptionModal.findOneAndUpdate(
            { "image._id": imageId },
            { $pull: { image: { _id: imageId } } },
            { new: true }
        );



        if (!description) {
            return res.status(500).json({ message: "Description not found" });
        }

        // Image successfully deleted
        res.status(200).json({ message: "Image deleted successfully", data: description, error: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message, error: 1 });
    }
};



exports.clearAllImages = async (req, res) => {
    try {
        const { descriptionId } = req.params;

        // Find the description by ID and remove all images
        const description = await DescriptionModal.findByIdAndUpdate(
            descriptionId,
            { $set: { image: [] } },
            { new: true }
        );

        if (!description) {
            return res.status(500).json({ message: "Description not found" });
        }

        // All images successfully deleted
        res.status(200).json({ message: "All images deleted successfully", data: description, error: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message, error: 1 });
    }
};



// exports.getdescription_by_store = async (req, res) => {
//     try {
//         const url = req.params.url;

//         const data = await DescriptionModal.aggregate([
//             {
//                 // Lookup to join store details based on the store field
//                 $lookup: {
//                     from: 'stores', // The name of the store collection
//                     localField: 'store', // Field from Description
//                     foreignField: '_id', // Field from Store
//                     as: 'storeDetail'
//                 }
//             },
//             {
//                 // Unwind the array of storeDetails (since lookup returns an array)
//                 $unwind: {
//                     path: '$storeDetail',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 // Match where the store's URL matches the provided URL
//                 $match: { 'storeDetail.url': url }
//             },
//             {
//                 // Project to include all fields from Description and relevant store details
//                 $project: {
//                     _id: 1,
//                     store_name: '$storeDetail.title', // Get the title from the store details
//                     image: '$storeDetail.image', // Image from the store details
//                     short_detail: 1, // Keep the short detail from Description
//                     detail: 1, // Keep the detail from Description
//                     created_by: 1,
//                     createdAt: 1,
//                     updatedAt: 1
//                 }
//             }
//         ]);

//         // If no data found, return an error
//         if (!data || data.length === 0) {
//             return res.status(404).json({ error: 1, message: "No description found for the given store URL" });
//         }

//         // Return the matched descriptions with all relevant fields
//         res.status(200).json({ error: 0, data });
//     } catch (err) {
//         res.status(500).json({ error: 1, message: err.message });
//     }
// };




exports.descriptionbyuser = async (req, res) => {
    try {
        const id = req.params.id

        // Find descriptions where the "created_by" field matches the provided user ID
        const data = await DescriptionModal.find({ "created_by": id }).populate({
            path: "created_by store",
            select: "_id name title url"
        });

        if (data.length > 0) {
            res.status(200).json({ data, message: "Data Fetched Successfully", error: 0 });
        } else {
            res.status(200).json({ data, message: "Data Not Found", error: 0 });
        }

        // Send the fetched data as a JSON response

    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
}
