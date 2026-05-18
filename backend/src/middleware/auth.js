const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1]; // 'Bearer TOKEN' format

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
        req.user = decoded; 
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};

/**
 * Role check karne ke liye middleware.
 * Use Case: authorize(['Admin', 'Account Owner'])
 */
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: "Access denied: No role found in token" });
        }

        // Case-sensitive check ko handle karne ke liye (Admin vs admin)
        const hasRole = roles.some(role => role.toLowerCase() === req.user.role.toLowerCase());

        if (!hasRole) {
            // Error message ko wahi rakha hai jo screenshot mein tha taake debugging asaan ho
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        
        next();
    };
};

module.exports = { authenticate, authorize };