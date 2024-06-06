// bannerController.js
const Banner = require('../model/Multipleimage'); // Adjust the path to your Banner model

// Create a new banner
exports.createBanner = (req, res) => {
    try {
        const { position } = req.body;
        const images = req.files.map(file => file.path);

        const newBanner = new Banner({ position, image: images });

        newBanner.save()
        res.status(200).send({ "status": "OK", "message": "Banner Created Successfully", error: 0 })
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: "1" })
    }
};



exports.getBanners = async (req, res) => {
    try {
        const data = await Banner.find()
        res.status(200).send({ "status": "OK", data: data })
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message })
    }
}


exports.getBannerById = (req, res) => {
    const { id } = req.params;

    Banner.findById(id)
        .then(banner => {
            if (!banner) {
                return res.status(404).json({ message: 'Banner not found' });
            }
            res.status(200).json(banner);
        })
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.updateBanner = (req, res) => {
    const { id } = req.params;
    const { position } = req.body;
    const images = req.files.map(file => file.path);

    Banner.findByIdAndUpdate(id, { position, image: images }, { new: true })
        .then(banner => {
            if (!banner) {
                return res.status(404).json({ message: 'Banner not found' });
            }
            res.status(200).send({ "status": "OK", "message": "Banner Updated Successfully", error: 0 })
        })
        .catch(err => res.status(500).json({ message: err.message, error: 1 }));
};




exports.deleteBanner = (req, res) => {
    const { id } = req.params;
    Banner.findByIdAndDelete(id)
        .then(banner => {
            if (!banner) {
                return res.status(404).json({ message: 'Banner not found' });
            }
            res.status(200).send({ "status": "OK", "message": "Banner Deleted Successfully", error: 0 })
        })
        .catch(err => res.status(500).json({ message: err.message, error: 1 }));
};

