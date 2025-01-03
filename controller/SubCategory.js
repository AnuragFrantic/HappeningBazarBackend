const SubCategoryModal = require("../model/SubCategoryModal")
const CategoriesModal = require("../model/CategoriesModal");
const { default: slugify } = require("slugify");
const { updateCategory } = require("./Categories");
const mongoose = require("mongoose")






exports.substore = async (req, res) => {
    try {
        const data = new SubCategoryModal(req.body);
        const images = req.files.map(file => ({ img: file.path }));

        const subServiceCard = new SubCategoryModal({
            ...req.body,
            image: images
        });
        await subServiceCard.save();
        res.status(201).json({ status: "OK", message: "Subcategory created successfully", error: 0 });
    } catch (e) {
        res.status(500).json({ status: "Failed", message: e.message, error: 1 });
    }
};

exports.getallsubcat = async (req, res) => {
    try {
        const data = await SubCategoryModal.find().populate("category")
        res.send({ "status": "OK", data: data })
    } catch (e) {
        res.status(500).json({ status: "Failed", message: e.message });
    }
}




exports.getbycategory = async (req, res) => {
    let catid = req.params.id;


    try {
        const data = await SubCategoryModal.find({ 'category': catid })
        if (!data) {
            return res.status(500).json({ status: "Failed", message: "Category not found", error: 1 });
        }
        res.status(200).json({ status: "Success", data, error: 0 });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: err.message, error: 1 });
    }
};

// exports.getbycategoryurl = async (req, res) => {
//     const url = req.params.url;


//     try {
//         const data = await SubCategoryModal.find()
//             .populate({
//                 path: 'category',
//                 match: { url: url }
//             });

//         // Filter out documents where `category` is null (no match found)
//         const filteredData = data.filter(subcategory => subcategory.category);

//         if (filteredData.length === 0) {
//             return res.status(200).json({ status: "Failed", message: "Category not found", error: 1 });
//         }

//         res.status(200).json({ status: "Success", data: filteredData, error: 0 });
//     } catch (err) {
//         res.status(500).json({ status: "Failed", message: err.message, error: 1 });
//     }
// };



exports.getbycategoryurl = async (req, res) => {
    const url = req.params.url;
    const { type } = req.query; // Extract 'type' from query parameters

    try {
        const data = await SubCategoryModal.find()
            .populate({
                path: 'category',
                match: { url: url }
            });

        // Filter out documents where `category` is null (no match found)
        let filteredData = data.filter(subcategory => subcategory.category);

        // Further filter by 'type' with partial matching if provided
        if (type) {
            const regex = new RegExp(type, 'i'); // Create a case-insensitive regex
            filteredData = filteredData.filter(subcategory => regex.test(subcategory.type));
        }

        if (filteredData.length === 0) {
            return res.status(200).json({ status: "Failed", message: "Category or type not found", error: 1 });
        }

        res.status(200).json({ status: "Success", data: filteredData, error: 0 });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: err.message, error: 1 });
    }
};




exports.deletesubcat = async (req, res) => {
    try {
        const data = await SubCategoryModal.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(500).send({ "status": "Failed", "message": "Category not found" });
        }
        res.status(200).send({ "status": "OK", "message": "SubCategory deleted successfully", data: data });
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message });
    }
}


exports.updateSubCategory = async (req, res) => {
    try {
        const categoryId = req.params.id; // Assuming category ID is passed in the request parameters
        const updateData = req.body; // Assuming the update data is sent in the request body

        // Fetch the existing subcategory to check if it exists
        const subcategory = await SubCategoryModal.findById(categoryId);
        if (!subcategory) {
            return res.status(500).json({ error: "Subcategory not found", error: 1 });
        }

        // If `type` is being updated, ensure the new `url` is unique
        if (updateData.type) {
            const baseSlug = slugify(updateData.type, { lower: true, remove: /[*+~.()'"!:@/]/g });

            // Check if a subcategory with the same baseSlug exists (excluding the current one)
            const existingSubcategory = await SubCategoryModal.findOne({ url: baseSlug, _id: { $ne: categoryId } });

            if (existingSubcategory) {
                // Generate a unique slug if a conflict is found
                updateData.url = await generateUniqueSlug(subcategory, baseSlug);
            } else {
                updateData.url = baseSlug;
            }
        }

        // Perform the update with the unique `url`
        const updatedCategory = await SubCategoryModal.findByIdAndUpdate(categoryId, updateData, { new: true });

        // If images are uploaded, update the images
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => ({ img: file.path }));
            subcategory.image.push(...images); // Append new images
            await subcategory.save();
        }

        res.status(200).send({ status: "OK", message: "Data Updated Successfully", data: updatedCategory, error: 0 });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error", error: 1 });
    }
};

// Function to generate a unique slug
async function generateUniqueSlug(instance, baseSlug, counter = 1) {
    const newSlug = `${baseSlug}-${counter}`;
    const existing = await mongoose.models.SubCategory.findOne({ url: newSlug });

    if (existing) {
        return generateUniqueSlug(instance, baseSlug, counter + 1);
    }

    return newSlug;
}





exports.getAllCategoriesWithSubcategories = async (req, res) => {
    try {
        // Fetch all categories and select necessary fields (name and description)
        const categories = await CategoriesModal.find().select('name description position url'); // You can add more fields if needed

        // Iterate through each category and fetch corresponding subcategories
        const result = await Promise.all(categories.map(async (category) => {
            // Find all subcategories related to the current category and include all fields
            const subcategories = await SubCategoryModal.find({ category: category._id });

            // Return category data along with the associated subcategories
            return {
                category: {
                    name: category.name,
                    description: category.description,
                    position: category.position,
                    url: category.url,
                },
                subcategories: subcategories // This will include all fields of each subcategory
            };
        }));

        res.status(200).json({
            status: "OK",
            data: result,
            error: 0
        });
    } catch (e) {
        res.status(500).json({
            status: "Failed",
            message: e.message,
            error: 1
        });
    }
};



exports.deleteImagesubsubCategory = async (req, res) => {
    try {
        const { imageId } = req.params;


        // Find the SubServiceCard containing the image to delete
        const subServiceCard = await SubCategoryModal.findOneAndUpdate(
            { 'image._id': imageId }, // Find by image _id
            { $pull: { image: { _id: imageId } } }, // Pull the image with matching _id from the array
            { new: true } // Return the updated document
        );

        if (!subServiceCard) {
            return res.status(200).json({ message: 'Subcategory not found', id: imageId });
        }

        // Image successfully deleted
        res.status(200).json({ message: 'Image deleted successfully', data: subServiceCard, error: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message, error: 1 });
    }
};