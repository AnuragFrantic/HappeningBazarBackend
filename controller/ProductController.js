const ProductModal = require("../model/ProductModel")



exports.createitem = async (req, res) => {
    try {
        // Create a new product instance with the request body
        const productData = req.body;

        // Create an instance of ProductModal
        const product = new ProductModal(productData);

        // Check if there are uploaded files (multiple files)
        if (req.files && req.files.length > 0) {

            req.files.forEach(file => {

                product.image.push({ img: file.path });
            });
        }



        // Save the product to the database
        await product.save();

        // Send success response
        res.status(201).json({ status: "OK", message: "Product created successfully", error: "0", data: product });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ status: "Error", message: "Product not created", error: "1" });
    }
};





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
            return res.status(500).send({ "status": "Failed", "message": "Product not found" });
        }
        res.status(200).send({ "status": "OK", "message": "Product deleted successfully", data: data, error: 0 });
    } catch (e) {
        res.status(500).json({ status: "OK", message: "Product Not Found", error: "1" });
    }
}


exports.updateitem = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Ensure req.files exists and has files
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => ({ img: file.path }));
        }

        // Find the existing product by ID
        let product = await ProductModal.findById(id);

        // If the product doesn't exist, return an error
        if (!product) {
            return res.status(500).send({ status: "Failed", message: "Product not found" });
        }

        // Update product fields with the data from req.body
        Object.assign(product, data);

        // Append new images to the existing image array if images are provided
        if (images.length > 0) {
            product.image = [...product.image, ...images];
        }

        // Save the updated product
        await product.save();

        // Send success response
        res.status(200).send({ status: "OK", message: "Product updated successfully", data: product, error: 0 });
    } catch (e) {
        // Handle errors
        res.status(500).send({ status: "Failed", message: e.message, error: 1 });
    }
};







exports.deleteProductImage = async (req, res) => {
    const { id, imageId } = req.params; // Assuming imageId is passed as a parameter

    try {
        // Find the product by ID
        let product = await ProductModal.findById(id);
        if (!product) {
            return res.status(404).send({ status: "Failed", message: "Product not found" });
        }

        // Find the index of the image to delete
        const imageIndex = product.image.findIndex(img => img._id.toString() === imageId);
        if (imageIndex === -1) {
            return res.status(404).send({ status: "Failed", message: "Image not found" });
        }

        // Remove the image from the array
        product.image.splice(imageIndex, 1);

        // Save the updated product
        await product.save();

        res.status(200).send({ status: "OK", message: "Image deleted successfully", data: product, error: 0 });
    } catch (e) {
        console.error(e); // Log the error for debugging
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




exports.getStoreurlbyproduct = async (req, res) => {
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
            },
            {
                // Project to only include required fields from the product and storeDetails
                $project: {
                    _id: 1,
                    name: 1,
                    detail: 1,
                    created_by: 1,
                    store: 1,
                    url: 1,
                    image: 1,
                    shortdetail: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    storeDetails: {
                        _id: '$storeDetails._id',
                        title: '$storeDetails.title'
                    }
                }
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



exports.findProductByUrl = async (req, res) => {
    const { url } = req.params; // Assuming URL is passed as a route parameter

    try {
        const product = await ProductModal.findOne({ url }).populate({
            path: "store",
            select: "title url" // Selecting fields from the Store model
        });

        if (!product) {
            return res.status(404).json({ status: "Error", message: "Product not found", error: "1" });
        }

        res.status(200).json({ status: "OK", message: "Product fetched successfully", error: "0", data: product });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ status: "Error", message: "Internal Server Error", error: "1" });
    }
};


