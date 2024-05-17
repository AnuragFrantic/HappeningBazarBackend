const SubCategoryModal = require("../model/SubCategoryModal")






exports.substore = async (req, res) => {
    try {
        const data = new SubCategoryModal(req.body);
        if (req.file) {
            data.image = req.file.path;
        }
        await data.save();
        res.status(201).json({ status: "OK", message: "Subcategory created successfully" });
    } catch (e) {
        res.status(500).json({ status: "Failed", message: e.message });
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







