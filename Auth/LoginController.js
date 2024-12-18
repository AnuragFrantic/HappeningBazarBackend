const Register = require("../model/Register");
const jwt = require("jsonwebtoken");

// Login Controller
exports.LoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(200).json({
                message: "Invalid email",
                details: [{ field: "email", message: "Invalid email" }],
                error: 1,
            });
        }

        // Validate password
        if (user.password !== password) {
            return res.status(200).json({
                message: "Invalid password",
                details: [{ field: "password", message: "Invalid password" }],
                error: 1,
            });
        }

        // User authenticated, generate JWT token
        const payload = { _id: user._id, type: user.type, status: user.status }; // Minimize payload for security
        const token = jwt.sign(payload, process.env.secretKey, { expiresIn: "24h" });

        res.status(200).json({
            error: 0,
            message: "You are successfully logged in",
            _id: user._id,
            token,
            type: user.type,
            status: user.status,
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({
            message: "Internal server error",
            error: 1,
        });
    }
};

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if authorization header exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided.",
                error: 1,
            });
        }

        // Extract token from authorization header
        const token = authHeader.split(" ")[1];

        // Verify token
        jwt.verify(token, process.env.secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid token.",
                    error: 1,
                });
            }
            req.user = decoded; // Attach decoded user data to the request object
            next();
        });
    } catch (error) {
        console.error("Error in token verification:", error);
        res.status(500).json({
            message: "Internal server error",
            error: 1,
        });
    }
};

// Get Profile Controller
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id; // User ID from the decoded token

        // Fetch user data based on the user ID from the token
        const userData = await Register.findById(userId);
        if (!userData) {
            return res.status(200).json({
                message: "User not found!",
                error: 1,
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            data: userData,
            error: 0,
        });
    } catch (error) {
        console.error("Error in getting profile:", error);
        res.status(500).json({
            message: "Internal server error",
            error: 1,
        });
    }
};

// Middleware to allow only admin
exports.adminAuth = (req, res, next) => {
    if (req.user.type !== "Admin") {
        return res.status(403).json({
            message: "Access denied. Admins only.",
            error: 1,
        });
    }
    next();
};
