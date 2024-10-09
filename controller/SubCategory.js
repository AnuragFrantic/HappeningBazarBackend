const SubCategoryModal = require("../model/SubCategoryModal")
const CategoriesModal = require("../model/CategoriesModal");
const { default: slugify } = require("slugify");
const { updateCategory } = require("./Categories");







exports.substore = async (req, res) => {
    try {
        const data = new SubCategoryModal(req.body);
        if (req.file) {
            data.image = req.file.path;
        }
        await data.save();
        res.status(201).json({ status: "OK", message: "Subcategory created successfully", error: "0" });
    } catch (e) {
        res.status(500).json({ status: "Failed", message: e.message, error: "1" });
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

        // If an image is uploaded, update the image path
        if (req.file) {
            updateData.image = req.file.path;
        }

        // Fetch the existing subcategory to check if the type or title has changed
        const subcategory = await SubCategoryModal.findById(categoryId);
        if (!subcategory) {
            return res.status(500).json({ error: "Subcategory not found", error: 1 });
        }

        // Update the `url` field based on the `type` field (or other fields if needed)
        if (updateData.type) {
            updateData.url = slugify(updateData.type, { lower: true, remove: /[*+~.()'"!:@/]/g });
        }

        // Perform the update
        const updatedCategory = await SubCategoryModal.findByIdAndUpdate(categoryId, updateData, { new: true });

        res.status(200).send({ status: "OK", message: "Data Updated Successfully", data: updatedCategory, error: 0 });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error", error: 1 });
    }
};






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

