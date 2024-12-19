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
        const { state, city } = req.query;

        // Build the filter object for state and city
        let filter = {};
        if (state) filter.state = state;
        if (city) filter.city = city;

        // Find stores with the optional filters and ensure the creator's status is 'accepted'
        const stores = await Store.find(filter)
            .populate({
                path: 'created_by',
                match: { status: 'accepted' }, // Only include stores where the creator's status is 'accepted'
                select: 'status'
            })
            .populate('category', 'name')
            .populate('subcategory', 'type url')
            .exec();

        // Remove any stores where the `created_by` did not match the filter
        const filteredStores = stores.filter(store => store.created_by);

        res.status(200).json({ error: 0, data: filteredStores });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};








// exports.getstores_by_Subcategory_url = async (req, res) => {
//     try {
//         const url = req.params.url;

//         const data = await Store.aggregate([
//             // Lookup subcategory details
//             {
//                 $lookup: {
//                     from: 'subcategories',
//                     localField: 'subcategory',
//                     foreignField: '_id',
//                     as: 'subcategoryDetails'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$subcategoryDetails',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             // Match stores by subcategory URL
//             {
//                 $match: { 'subcategoryDetails.url': url }
//             },
//             // Lookup category details
//             {
//                 $lookup: {
//                     from: 'categories',
//                     localField: 'category',
//                     foreignField: '_id',
//                     as: 'categoryDetails'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$categoryDetails',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             // Lookup created_by (assuming created_by refers to a users collection)
//             {
//                 $lookup: {
//                     from: 'registers', // Replace 'registers' with the actual collection name for users
//                     localField: 'created_by',
//                     foreignField: '_id',
//                     as: 'createdByDetails'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$createdByDetails',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             // Match only stores where created_by.status is 'accepted'
//             {
//                 $match: { 'createdByDetails.status': 'accepted' }
//             },
//             // Select relevant fields
//             {
//                 $project: {
//                     _id: 1,
//                     title: 1,
//                     desc: 1,
//                     image: 1,
//                     category: '$categoryDetails',
//                     subcategory: 1,
//                     description: 1,
//                     product: 1,
//                     url: 1,
//                     created_by: {
//                         _id: '$createdByDetails._id',
//                         name: '$createdByDetails.name',
//                         status: '$createdByDetails.status'
//                     }, // Include only specific fields for created_by
//                     createdAt: 1,
//                     updatedAt: 1,
//                     'subcategoryDetails._id': 1,
//                     'subcategoryDetails.type': 1,
//                     'subcategoryDetails.url': 1
//                 }
//             }
//         ]);

//         // If no data found, return an error
//         if (!data || data.length === 0) {
//             return res.status(200).json({ error: 1, message: "No stores found for the given subcategory URL" });
//         }

//         // Return the matched stores with all store fields and populated subcategory, category, and created_by details
//         res.status(200).json({ error: 0, data });
//     } catch (err) {
//         res.status(500).json({ error: 1, message: err.message });
//     }
// };

exports.getstores_by_Subcategory_url = async (req, res) => {
    try {
        const url = req.params.url;
        const { title } = req.query;

        const data = await Store.aggregate([
            // Lookup subcategory details
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategory',
                    foreignField: '_id',
                    as: 'subcategoryDetails'
                }
            },
            {
                $unwind: {
                    path: '$subcategoryDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Match stores by subcategory URL
            {
                $match: { 'subcategoryDetails.url': url }
            },
            // Lookup category details
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: {
                    path: '$categoryDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Lookup created_by (assuming created_by refers to a users collection)
            {
                $lookup: {
                    from: 'registers', // Replace 'registers' with the actual collection name for users
                    localField: 'created_by',
                    foreignField: '_id',
                    as: 'createdByDetails'
                }
            },
            {
                $unwind: {
                    path: '$createdByDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Match only stores where created_by.status is 'accepted'
            {
                $match: { 'createdByDetails.status': 'accepted' }
            },
            // Filter by title if provided
            ...(title
                ? [
                    {
                        $match: { title: { $regex: title, $options: 'i' } } // Case-insensitive partial match for title
                    }
                ]
                : []),
            // Select relevant fields
            {
                $project: {
                    _id: 1,
                    title: 1,
                    desc: 1,
                    image: 1,
                    category: '$categoryDetails',
                    subcategory: 1,
                    description: 1,
                    product: 1,
                    url: 1,
                    created_by: {
                        _id: '$createdByDetails._id',
                        name: '$createdByDetails.name',
                        status: '$createdByDetails.status'
                    }, // Include only specific fields for created_by
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
            return res.status(200).json({ error: 1, message: "No stores found for the given subcategory URL or title" });
        }

        // Return the matched stores with all store fields and populated subcategory, category, and created_by details
        res.status(200).json({ error: 0, data });
    } catch (err) {
        res.status(500).json({ error: 1, message: err.message });
    }
};








exports.getstores_by_Category_url = async (req, res) => {
    try {
        const url = req.params.url; // Get the category URL from the request parameters

        const data = await Store.aggregate([
            {
                // Lookup to join category details based on the category field
                $lookup: {
                    from: 'categories', // The name of the category collection
                    localField: 'category', // Field from Store
                    foreignField: '_id', // Field from Category
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: {
                    path: '$categoryDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
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
                $match: { 'categoryDetails.url': url } // Match stores by the category URL
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
                    'categoryDetails._id': 1,
                    'categoryDetails.name': 1,
                    'categoryDetails.url': 1,
                    'subcategoryDetails._id': 1,
                    'subcategoryDetails.type': 1,
                    'subcategoryDetails.url': 1
                }
            }
        ]);

        // If no data found, return an error
        if (!data || data.length === 0) {
            return res.status(201).json({ error: 1, message: "No stores found for the given category URL" });
        }

        // Return the matched stores with all store fields and populated category and subcategory details
        res.status(200).json({ error: 0, data });
    } catch (err) {
        console.error("Error fetching stores by category URL:", err);
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
    const vendorid = req.params.id;

    try {
        const stores = await Store.find({ created_by: vendorid })
            .populate({
                path: 'created_by',
                match: { status: 'accepted' }, // Ensure creator's status is 'accepted'
                select: 'status'
            })
            .populate('category', 'name')
            .populate('subcategory', 'type');

        // Filter stores where `created_by` matches the criteria
        const filteredStores = stores.filter(store => store.created_by);

        res.status(200).json({ error: 0, data: filteredStores });
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



