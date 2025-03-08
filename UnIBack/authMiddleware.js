const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];  // Extract token from "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach user info to request
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;