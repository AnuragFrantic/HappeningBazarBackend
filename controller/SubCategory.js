const SubCategoryModal = require("../model/SubCategoryModal")






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
        const data = await SubCategoryModal.find({ 'category': catid }).populate("category")
        if (!data) {
            return res.status(404).json({ status: "Failed", message: "Category not found", error: 1 });
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
            return res.status(404).send({ "status": "Failed", "message": "Category not found" });
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

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedCategory = await SubCategoryModal.findByIdAndUpdate(categoryId, updateData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ error: "Subcategory not found" });
        }

        res.status(200).send({ "status": "OK", "message": "Data Updated Successfully", error: 0 })
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error", error: 1 });
    }
};






