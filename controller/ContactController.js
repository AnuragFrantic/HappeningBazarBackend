const contact = require('../model/ContactUs')


exports.createContact = async (req, res) => {
    try {
        const data = new contact(req.body)
        await data.save()
        res.status(200).send({ "status": "OK", "message": "Message Sent Successfully", error: 0 });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: e.message, error: "1" });
    }
}

exports.getContact = async (req, res) => {
    try {
        const data = await contact.find()
        res.status(200).send({ "status": "OK", "message": "Fetch Contact Successfully", error: 0, data: data });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: e.message, error: "1" });
    }
}