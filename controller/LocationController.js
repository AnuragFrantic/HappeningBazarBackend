const LocationModal = require("../model/LocationModal")


exports.postlocation = async (req, res) => {
    try {
        const data = new LocationModal(req.body)
        await data.save()
        res.status(200).send({ error: 0, "message": "Data Created Successfully" })
    } catch (e) {
        res.status(500).send({ error: 1, "message": e.message })
    }
}


exports.getlocation = async (req, res) => {
    try {
        const data = await LocationModal.find()
        res.status(200).send({ error: 0, data: data })
    } catch (e) {
        res.status(500).send({ error: 1, "message": e.message })
    }
}