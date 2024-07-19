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
        const data = await ProductModal.find().populate({
            path: "store",
            select: "title url"
        })
        res.status(201).json({ status: "OK", message: "Product fecth successfully", error: "0", data: data });
    } catch (e) {
        res.status(500).json({ status: "OK", message: "Product Not Found", error: "1" });
    }
}


exports.deleteitem = async (req, res) => {

    try {
        const data = await ProductModal.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(404).send({ "status": "Failed", "message": "Product not found" });
        }
        res.status(200).send({ "status": "OK", "message": "Product deleted successfully", data: data, error: 0 });
    } catch (e) {
        res.status(500).json({ status: "OK", message: "Product Not Found", error: "1" });
    }
}


exports.updateitem = async (req, res) => {
    const { id } = req.params;


    try {
        // Find the product by ID
        let product = await ProductModal.findById(id);
        if (!product) {
            return res.status(404).send({ "status": "Failed", "message": "Product not found" });
        }

        // Update the product's image if a new file is provided
        if (req.file) {
            product.image = req.file.path;
        }

        // Update other product fields with the data from req.body
        Object.assign(product, req.body);

        // Save the updated product
        await product.save();

        res.status(200).send({ "status": "OK", "message": "Product updated successfully", data: product, error: 0 });
    } catch (e) {
        res.status(500).json({ status: "Failed", message: e.message, error: 1 });
    }
};



exports.getuserProduct = async (req, res) => {
    try {
        const { id } = req.query;
        const data = await ProductModal.find({ 'created_by': id })
        res.status(201).json({ status: "OK", message: "Product fecth successfully", error: "0", data: data });
    } catch (err) {
        res.status(500).json({ status: "OK", message: "Product Not Found", error: "1" })
    }
}


exports.getProductByUrl = async (req, res) => {
    try {
        const url = req.params.url;


        const products = await ProductModal.aggregate([
            {
                $lookup: {
                    from: 'stores',
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

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the given URL' });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            data: products,
            error: 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
