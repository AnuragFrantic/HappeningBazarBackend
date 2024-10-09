const Store = require("../model/CreateStore");
const slugify = require('slugify');
const SubCategoryModal = require("../model/SubCategoryModal");

exports.createStore = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.image = req.file.path;
        }
        const newStore = new Store(data);
        const savedStore = await newStore.save();

        res.status(201).json({ error: 0, data: savedStore });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};


exports.getAllStores = async (req, res) => {
    try {

        const stores = await Store.find()
            .populate('category', 'name')
            .populate('subcategory', 'type url');

        res.status(200).json({ error: 0, data: stores });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};




exports.getstores_by_Subcategory_url = async (req, res) => {
    try {
        const url = req.params.url;

        const data = await Store.aggregate([
            {
                // Lookup to join subcategory details based on the subcategory field
                $lookup: {
                    from: 'subcategories', // The name of the subcategory collection
                    localField: 'subcategory', // Field from Store
                    foreignField: '_id', // Field from SubCategory
                    as: 'subcategoryDetails'
                }
            },
            {

                $unwind: {
                    path: '$subcategoryDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: { 'subcategoryDetails.url': url }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    desc: 1,
                    image: 1,
                    category: 1,
                    subcategory: 1,
                    description: 1,
                    product: 1,
                    url: 1,
                    created_by: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'subcategoryDetails._id': 1,
                    'subcategoryDetails.type': 1,
                    'subcategoryDetails.url': 1
                }
            }
        ]);

        // If no data found, return an error
        if (!data || data.length === 0) {
            return res.status(201).json({ error: 1, message: "No stores found for the given subcategory URL" });
        }

        // Return the matched stores with all store fields and populated subcategory details
        res.status(200).json({ error: 0, data });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};







// Get a single store by ID
exports.getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id).populate('category', 'name')
            .populate('subcategory', 'type');
        if (!store) {
            return res.status(500).json({ error: 1, message: "Store not found" });
        }
        res.status(200).json({ error: 0, data: store });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};


exports.getvendorstore = async (req, res) => {
    let vendorid = req.params.id


    try {
        const store = await Store.find({ "created_by": vendorid }).populate('category', 'name')
            .populate('subcategory', 'type');
        res.status(200).json({ error: 0, data: store });

    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
}

// Update a store
exports.updateStore = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.image = req.file.path;
        }


        if (data.title && !data.url) {
            data.url = slugify(data.title, { lower: true, remove: /[*+~.()'"!:@/]/g });
        }
        const updatedStore = await Store.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!updatedStore) {
            return res.status(500).json({ error: 1, message: "Store not found" });
        }
        res.status(200).json({ error: 0, data: updatedStore });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};

// Delete a store



exports.deleteStore = async (req, res) => {
    try {
        const data = await Store.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(500).send({ "status": "Failed", "message": "Store not found" });
        }
        res.status(200).send({ "status": "OK", "message": "Store deleted successfully", data: data, error: 0 });
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: 1 });
    }
}


