const reportmodal = require('../model/Report')
const User = require('../model/Register')

exports.reportraise = async (req, res) => {
    try {
        const data = await User.findById(req.body.user)
        if (data) {
            let create = await reportmodal(req.body)
            await create.save()
            res.status(201).json({ status: "OK", message: "Report Raised successfully", error: 0 });
        } else {
            res.status(500).json({ status: "OK", message: "Venodr Not Found", error: 0 });
        }
    } catch (err) {
        res.status(500).json({ status: "OK", message: "Venodr Not Found", error: 0 });
    }
}


exports.getAllreport = async (req, res) => {
    try {
        const data = await reportmodal.find().populate({
            path: "user",
            select: "_id name"
        })
        res.status(201).json({ status: "OK", message: "Report Fetched successfully", error: 0, data });
    } catch (err) {
        res.status(500).json({ status: "OK", message: "Report Not Found", error: 0 });
    }
}


exports.getuserreport = async (req, res) => {
    try {
        let { id } = req.query;
        const data = await reportmodal.find({ "user": id }).populate({
            path: "user",
            select: "_id name"
        })
        res.status(201).json({ status: "OK", message: "Report Fetched successfully", error: 0, data });
    } catch (err) {
        res.status(500).json({ status: "OK", message: "Report Not Found", error: 0 });
    }
}