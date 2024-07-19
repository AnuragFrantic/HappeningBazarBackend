const Store = require("../model/CreateStore");
const slugify = require('slugify');

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

// Get all stores
exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find().populate('category');
        res.status(200).json({ error: 0, data: stores });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};

// Get a single store by ID
exports.getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id).populate('category');
        if (!store) {
            return res.status(404).json({ error: 1, message: "Store not found" });
        }
        res.status(200).json({ error: 0, data: store });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};

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
            return res.status(404).json({ error: 1, message: "Store not found" });
        }
        res.status(200).json({ error: 0, data: updatedStore });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};

// Delete a store
exports.deleteStore = async (req, res) => {
    try {
        const deletedStore = await Store.findByIdAndDelete(req.params.id);
        if (!deletedStore) {
            return res.status(404).json({ error: 1, message: "Store not found" });
        }
        res.status(200).json({ error: 0, message: "Store deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};


