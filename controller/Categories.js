const CategoriesModal = require("../model/CategoriesModal")
const { findByIdAndDelete } = require("../model/SubCategoryModal")



exports.storeCat = async (req, res) => {
    try {
        const data = new CategoriesModal(req.body)

        if (req.files) {
            if (req.files.image) {
                data.image = req.files.image[0].path;
            }
            if (req.files.icon) {
                data.icon = req.files.icon[0].path;
            }
            if (req.files.banner) {
                data.banner = req.files.banner[0].path;
            }
        }
        await data.save()
        res.status(200).send({ "status": "OK", "message": "Data Created Successfully", error: 0 })
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message })
    }
}


exports.getAllCategory = async (req, res) => {
    try {
        const data = await CategoriesModal.find()
        res.status(200).send({ "status": "OK", data: data, error: 0 })
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: 1 })
    }
}


exports.getCategorybyurl = async (req, res) => {
    try {
        const data = await CategoriesModal.findOne({ url: req.params.url })
        res.status(200).send({ "status": "OK", data: data, error: 0 })
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: 1 })
    }
}




exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updateData = req.body;

        // Check if files are included in the request
        if (req.files) {
            if (req.files.image) {
                // Update the image path in the updateData object
                updateData.image = req.files.image[0].path;
            }
            if (req.files.icon) {
                // Update the icon path in the updateData object
                updateData.icon = req.files.icon[0].path;
            }
            if (req.files.banner) {
                updateData.banner = req.files.banner[0].path;
            }
        }

        // Find the category by ID and update it with the new data
        const updatedCategory = await CategoriesModal.findByIdAndUpdate(categoryId, updateData, { new: true });

        if (!updatedCategory) {
            return res.status(200).send({ status: "Failed", message: "Category not found", error: 1 });
        }

        res.status(200).send({ status: "OK", message: "Category Updated Successfully", error: 0, data: updatedCategory });
    } catch (e) {
        res.status(500).send({ status: "Failed", message: e.message, error: 1 });
    }
};






exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await CategoriesModal.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(500).send({ "status": "Failed", "message": "Category not found" });
        }
        res.status(200).send({ "status": "OK", "message": "Category deleted successfully", data: deletedCategory, error: 0 });
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: 1 });
    }
}