const DescriptionModal = require("../model/Description")
const UserModal = require('../model/Register')

exports.createdescription = async (req, res) => {
    try {

        const user = await UserModal.findById({ "_id": req.body.created_by });

        if (user.status == "cancelled" || user.status == "pending") {
            res.status(200).send({ "status": "Failed", "message": `Your application is ${user.status}, which is why you cannot upload products.`, error: "1" });
        } else {
            const images = req.files.map(file => ({ img: file.path }));

            const newDescription = new DescriptionModal({
                ...req.body, 
                image: images
            });
            console.log(newDescription)

            await newDescription.save();


            // Find the user associated with the event
            // Assuming userId is set in the request

            // Update the user's events array
            user.description.push(newDescription._id); // Assuming user.events is an array of event IDs
            await user.save();
            res.status(200).send({ "status": "OK", "message": "Description Created Successfully", error: 0, data: newDescription });
        }




    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: "1" });
    }
}




exports.getalldescription = async (req, res) => {
    try {
        const data = await DescriptionModal.find().populate({
            path: "created_by",
            select: "_id name"
        });

        res.status(200).send({ "message": "Get Data Successfully", error: 0, data: data });
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: "1" });
    }
}




exports.deletedesc = async (req, res) => {
    try {
        const data = await DescriptionModal.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(404).send({ "status": "Failed", "message": "Description not found" });
        }
        res.status(200).send({ "status": "OK", "message": "Description deleted successfully", data: data });
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message });
    }
}



exports.updatedescription = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const images = req.files.map(file => ({ img: file.path }));

        // Find the existing description by ID
        let description = await DescriptionModal.findById(id);

        // If the description doesn't exist, return a 404 error
        if (!description) {
            return res.status(404).send({ "status": "Failed", "message": "Description not found" });
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
            return res.status(404).json({ message: "Description not found" });
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
            return res.status(404).json({ message: "Description not found" });
        }

        // All images successfully deleted
        res.status(200).json({ message: "All images deleted successfully", data: description, error: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message, error: 1 });
    }
};



exports.descriptionbyuser = async (req, res) => {
    try {
        const { id } = req.query;

        // Find descriptions where the "created_by" field matches the provided user ID
        const data = await DescriptionModal.find({ "created_by": id });

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
