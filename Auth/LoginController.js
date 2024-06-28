const Register = require('../model/Register');
const jwt = require("jsonwebtoken");

const secretKey = "sfdsdf"




exports.LoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(201).json({ message: "Invalid email", details: [{ field: "email", message: "Invalid email" }], error: 1 });
        }

        if (user.password !== password) {
            return res.status(201).json({ message: "Invalid password", details: [{ field: "password", message: "Invalid password" }], error: 1 });
        }

        // User authenticated, generate JWT token
        jwt.sign({ user }, secretKey, { expiresIn: '8086h' }, (err, token) => {
            if (err) {
                console.error("Error in generating token:", err);
                return res.status(500).json({ error: "Error in generating token", details: [{ field: "token", message: "Error in generating token" }], error: 1 });
            }
            // Send the token in the response
            res.status(200).json({ error: 0, message: "You are successfully logged in", _id: user._id, token, type: user.type, status: user.status });
        });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};






// Middleware to verify token
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Extract token from authorization header
    const token = authHeader.split(" ")[1];

    // Verify token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token." });
        }
        req.user = decoded.user;
        next();
    });
};

// Middleware to allow only admin
exports.adminAuth = (req, res, next) => {
    if (req.user.type !== 'Admin') {
        return res.status(403).json({ message: "Access denied." });
    }
    next();
};




