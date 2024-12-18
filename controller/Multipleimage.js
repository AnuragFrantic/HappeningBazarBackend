
const Banner = require('../model/Multipleimage'); // Adjust the path to your Banner model


exports.createBanner = (req, res) => {
    try {
        const { position, type, title } = req.body;
        const images = req.files.map(file => file.path);

        const newBanner = new Banner({ position, image: images, type, title });
        newBanner.save()
        res.status(200).send({ "status": "OK", "message": "Banner Created Successfully", error: 0 })
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: 1 })
    }
};



exports.getBanners = async (req, res) => {
    try {
        const { type } = req.query;


        const query = type ? { type } : {};


        const data = await Banner.find(query);

        // Send the response
        res.status(200).send({ "status": "OK", data: data, error: 0 });
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: 1 });
    }
};



exports.getBannerById = (req, res) => {
    const { id } = req.params;

    Banner.findById(id)
        .then(banner => {
            if (!banner) {
                return res.status(500).json({ message: 'Banner not found', error: 1 });
            }
            res.status(200).send({ "status": "OK", data: banner, error: 0 })
        })
        .catch(err => res.status(500).json({ message: err.message, error: 1 }));
};

exports.updateBanner = (req, res) => {
    const { id } = req.params;
    const { position, title, type } = req.body;

    // Check if files are uploaded and map their paths
    const images = req.files?.length > 0 ? req.files.map(file => file.path) : null;

    // Build the update object dynamically
    const updateData = { position, type, title };

    if (images) {
        updateData.image = images; // Add images to update only if they exist
    }

    // Update the Banner with the built updateData
    Banner.findByIdAndUpdate(id, updateData, { new: true })
        .then(banner => {
            if (!banner) {
                return res.status(200).json({ message: 'Banner not found', error: 1 });
            }
            res.status(200).send({ status: "OK", message: "Banner Updated Successfully", error: 0 });
        })
        .catch(err => res.status(500).json({ message: err.message, error: 1 }));
};





exports.deleteBanner = (req, res) => {
    const { id } = req.params;
    Banner.findByIdAndDelete(id)
        .then(banner => {
            if (!banner) {
                return res.status(500).json({ message: 'Banner not found', error: 1 });
            }
            res.status(200).send({ "status": "OK", "message": "Banner Deleted Successfully", error: 0 })
        })
        .catch(err => res.status(500).json({ message: err.message, error: 1 }));
};

