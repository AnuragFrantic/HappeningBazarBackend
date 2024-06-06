// const Banner = require("../model/Banner")






// exports.createbanner = async (req, res) => {
//     try {
//         const bannerbody = new Banner(req.body)
//         if (req.file) {
//             bannerbody.image = req.file.path
//         }

//         await bannerbody.save()
//         res.status(200).send({ "status": "OK", "message": "Data Created Successfully", error: 0 })
//     } catch (e) {
//         res.status(500).send({ "status": "Failed", "message": e.message, error: "1" })
//     }

// }


// exports.getallbanner = async (req, res) => {
//     try {
//         const data = await Banner.find()
//         res.status(200).send({ status: "OK", message: "Get All Banner", error: 0, data: data })
//     } catch (e) {
//         res.status(500).send({ status: "Failed", message: e.message, error: "1" })
//     }
// }


// exports.putbanner = async (req, res) => {
//     try {
//         const updatedata = { ...req.body }

//         if (req.file) {
//             updatedata.image = req.file.path
//         }

//         const data = await Banner.findByIdAndUpdate(req.body._id, updatedata, { new: true });
//         if (!data) {
//             return res.status(404).json({ message: "Banner not found" })
//         }
//         res.status(200).json({ message: "Banner Updated", error: "0" })
//     } catch (error) {
//         console.error("Error in updating the Banner:", error);
//         res.status(500).json({ error: "1", message: "Internal server error" });
//     }

// }


// exports.putRegister = async (req, res) => {
//     try {
//         const updateData = { ...req.body };

//         // Attach uploaded image path if available
//         if (req.file) {
//             updateData.image = req.file.path;
//         }

//         const user = await Register.findByIdAndUpdate(req.body._id, updateData, { new: true });

//         if (!user) {
//             return res.status(404).json({ message: "User not found!" });
//         }

//         res.status(200).json({ message: "Data Update Succesfully", error: "0" });
//     } catch (error) {
//         console.error("Error in updating the user:", error);
//         res.status(500).json({ error: "1", message: "Internal server error" });
//     }
// };