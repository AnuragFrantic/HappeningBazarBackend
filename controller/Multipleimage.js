
const Banner = require('../model/Multipleimage'); // Adjust the path to your Banner model


exports.createBanner = (req, res) => {
    try {
        const { position } = req.body;
        const images = req.files.map(file => file.path);

        const newBanner = new Banner({ position, image: images });
        newBanner.save()
        res.status(200).send({ "status": "OK", "message": "Banner Created Successfully", error: 0 })
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: 1 })
    }
};



exports.getBanners = async (req, res) => {
    try {
        const data = await Banner.find()
        res.status(200).send({ "status": "OK", data: data, error: 0 })
    } catch (e) {
        res.status(500).send({ "status": "Failed", "message": e.message, error: 1 })
    }
}


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
    const { position } = req.body;
    const images = req.files.map(file => file.path);

    Banner.findByIdAndUpdate(id, { position, image: images }, { new: true })
        .then(banner => {
            if (!banner) {
                return res.status(500).json({ message: 'Banner not found', error: 1 });
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
                return res.status(500).json({ message: 'Banner not found', error: 1 });
            }
            res.status(200).send({ "status": "OK", "message": "Banner Deleted Successfully", error: 0 })
        })
        .catch(err => res.status(500).json({ message: err.message, error: 1 }));
};

