const CategoriesModal = require("../model/CategoriesModal")
const { findByIdAndDelete } = require("../model/SubCategoryModal")



exports.storeCat = async (req, res) => {
    try {
        const create = new CategoriesModal(req.body)
        await create.save()
        res.status(200).send({ "status": "OK", "message": "Data Created Successfully" })
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message })
    }
}


exports.getAllCategory = async (req, res) => {
    try {
        const data = await CategoriesModal.find()
        res.status(200).send({ "status": "OK", data: data })
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message })
    }
}


const CategoriesModal = require('./path/to/categoriesModel'); // Import your CategoriesModal schema

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id; // Assuming category ID is passed in the request parameters
        const updateData = req.body; // Assuming the update data is sent in the request body

        const updatedCategory = await CategoriesModal.findByIdAndUpdate(categoryId, updateData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await CategoriesModal.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).send({ "status": "Failed", "message": "Category not found" });
        }
        res.status(200).send({ "status": "OK", "message": "Category deleted successfully", data: deletedCategory });
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message });
    }
}