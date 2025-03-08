const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Received Auth Header:", authHeader);  // Debugging

    const token = authHeader?.split(" ")[1];
    console.log("Extracted Token:", token);  // Debugging

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    try {
        console.log("Verifying Token...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(403).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
