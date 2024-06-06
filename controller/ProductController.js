const ProductModal = require("../model/ProductModel")



exports.createitem = async (req, res) => {
    try {
        const data = await ProductModal(req.body)
        if (req.file) {
            data.image = req.file.path
        }
        await data.save()
        res.status(201).json({ status: "OK", message: "Product created successfully", error: "0" });
    } catch (e) {
        res.status(500).json({ status: "OK", message: "Product Not created", error: "1" });
    }
}


exports.getallitem = async (req, res) => {
    try {
        const data = await ProductModal.find()
        res.status(201).json({ status: "OK", message: "Product fecth successfully", error: "0", data: data });
    } catch (e) {
        res.status(500).json({ status: "OK", message: "Product Not Found", error: "1" });
    }
}