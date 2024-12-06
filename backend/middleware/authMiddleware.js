const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwtConfig'); // Adjust the path as necessary

const protectAdmin = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.admin = decoded; // Attach admin info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protectAdmin };