const { mailtouser, mailtoadmin } = require("../middleware/EmailContent");
const { send_email } = require("../middleware/SendEmail");
const Register = require("../model/Register");
const jwt = require("jsonwebtoken")

const secretKey = "Secretkey";






// exports.PostRegister = async (req, res) => {
//     try {

//         let existingUser = await Register.findOne({ email: req.body.email });
//         if (existingUser) {
//             return res.status(500).json({ error: "1", message: "Email already exists", details: [{ field: "email", message: "Email already exists" }] });
//         }

//         // Create a new instance of the Register model with request body
//         let registerBody = new Register(req.body);

//         // Check if email is provided
//         if (!req.body.email) {
//             return res.status(400).json({ error: "1", message: "Email is required" });
//         }

//         // Attach uploaded image path if available
//         if (req.file) {
//             registerBody.image = req.file.path;
//         }

//         // Set status based on the type
//         if (registerBody.type === 'User' || registerBody.type === 'Admin') {
//             registerBody.status = 'accepted';
//         } else {
//             registerBody.status = 'pending';
//         }

//         // Validate the required fields before saving
//         const validationError = registerBody.validateSync();
//         if (validationError) {
//             let errorDetails = Object.keys(validationError.errors).map(field => ({
//                 field: field,
//                 message: validationError.errors[field].message
//             }));

//             // Include email in error details if missing
//             if (!req.body.email) {
//                 errorDetails.push({ field: "email", message: "Email is required" });
//             } if (!req.body.password) {
//                 errorDetails.push({ field: "password", message: "Password is required" });
//             }

//             return res.status(400).json({ error: "1", message: "Please fill out the form properly.", details: errorDetails });

//         }

//         // Save the new user
//         await registerBody.save();

//         // const message_html2 = mailtoadmin({ email: registerBody.email, mobile: registerBody.mobile, name: registerBody.name, date: new Date(), role: registerBody.type });
//         // send_email('ap1663392@gmail.com', 'New User Created', message_html2);
//         // const message_user = mailtouser({ name: registerBody.name });
//         // send_email(registerBody.email, 'Account created on Happening Bazar', message_user);

//         res.status(201).json({ error: "0", message: "User created successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "1", message: "Internal server error" });
//     }
// };

exports.PostRegister = async (req, res) => {
    try {
        // Check if the email is already registered
        let existingUser = await Register.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                error: "1",
                message: "Email already exists",
                details: [{ field: "email", message: "Email already exists" }]
            });
        }

        // Check if the phone number is already registered
        let existingPhoneUser = await Register.findOne({ phone: req.body.mobile });
        if (existingPhoneUser) {
            return res.status(400).json({
                error: "1",
                message: "Phone number already exists",
                details: [{ field: "phone", message: "Phone number already exists" }]
            });
        }

        // Create a new instance of the Register model with request body
        let registerBody = new Register(req.body);

        // Check if email is provided
        if (!req.body.email) {
            return res.status(400).json({
                error: "1",
                message: "Email is required"
            });
        }

        // Attach uploaded image path if available
        if (req.file) {
            registerBody.image = req.file.path;
        }

        // Set status based on the type
        if (registerBody.type === 'User' || registerBody.type === 'Admin') {
            registerBody.status = 'accepted';
        } else {
            registerBody.status = 'pending';
        }

        // Validate the required fields before saving
        const validationError = registerBody.validateSync();
        if (validationError) {
            let errorDetails = Object.keys(validationError.errors).map(field => ({
                field: field,
                message: validationError.errors[field].message
            }));

            // Include email in error details if missing
            if (!req.body.email) {
                errorDetails.push({ field: "email", message: "Email is required" });
            }
            if (!req.body.password) {
                errorDetails.push({ field: "password", message: "Password is required" });
            }

            return res.status(400).json({
                error: "1",
                message: "Please fill out the form properly.",
                details: errorDetails
            });
        }

        // Save the new user
        await registerBody.save();

        // Uncomment the following lines if you want to send emails after user creation
        // const message_html2 = mailtoadmin({ email: registerBody.email, mobile: registerBody.mobile, name: registerBody.name, date: new Date(), role: registerBody.type });
        // send_email('ap1663392@gmail.com', 'New User Created', message_html2);
        // const message_user = mailtouser({ name: registerBody.name });
        // send_email(registerBody.email, 'Account created on Happening Bazar', message_user);

        res.status(201).json({ error: "0", message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "1", message: "Internal server error" });
    }
};



exports.getallRegister = async (req, res) => {
    try {
        const data = await Register.find();
        if (!data || data.length === 0) {
            return res.status(500).json({ message: 'Data Not Found' });
        }
        res.status(200).json({ data: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}









exports.putRegister = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Attach uploaded image path if available
        if (req.file) {
            updateData.image = req.file.path;
        }

        const user = await Register.findByIdAndUpdate(req.body._id, updateData, { new: true });

        if (!user) {
            return res.status(500).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "Data Update Succesfully", error: "0" });
    } catch (error) {
        console.error("Error in updating the user:", error);
        res.status(500).json({ error: "1", message: "Internal server error" });
    }
};




exports.deleteRegister = async (req, res) => {
    try {
        const user = await Register.findByIdAndDelete(req.body._id, req.body, { useFindAndModify: false });

        if (!user) {
            return res.status(500).json({ message: "User not found!" });

        }
        res.status(200).json({ message: "Deleted Successfully!" });
    } catch (err) {
        console.error("Error in updating the user:", err);
        res.status(500).json({ error: "0" });
    }
}





exports.getbyUser = async (req, res) => {
    try {
        const { type } = req.params
        console.log(type)
    } catch (error) {
        console.error("Error in getting profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}





exports.getbyUser = async (req, res) => {
    try {
        const { type } = req.query; // Extract the type from req.query
        const data = await Register.find({ type: type, status: "accepted" })

        // Respond with the fetched data
        res.status(200).json({ data });
    } catch (error) {
        console.error("Error in getting profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}