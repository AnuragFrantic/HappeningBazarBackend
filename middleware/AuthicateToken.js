const jwt = require('jsonwebtoken');

// Function to verify the token
function authenticateToken(req, res, next) {
    try {
        // Get the token from the request header
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Access Denied. No token provided.',
                error: 1,
            });
        }

        // Check for 'Bearer ' prefix and extract the token
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7, authHeader.length).trim()
            : authHeader;

        // Verify the token using the secret key
        const secretKey = process.env.secretKey;

        if (!secretKey) {
            throw new Error('Secret key not defined in environment variables');
        }

        const verified = jwt.verify(token, secretKey);

        req.user = verified; // Attach the user data to the request object
        next(); // Call the next middleware function
    } catch (err) {
        res.status(403).json({
            status: 'Failed',
            message: 'Invalid or expired token.',
            error: 1,
        });
    }
}

module.exports = authenticateToken;
