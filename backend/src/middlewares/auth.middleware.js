import jwt from 'jsonwebtoken';
import Admin from '../modules/admin/models/admin.model.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Authentication required. Please login." });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtErr) {
            return res.status(401).json({ error: "Invalid or expired token. Please login again." });
        }

        const adminUser = await Admin.findByPk(decoded.id, {
            attributes: {
                exclude: ['password', 'verificationToken', 'verificationTokenExpiry', 'resetPasswordCode', 'resetPasswordExpiry']
            }
        });

        if (!adminUser) {
            return res.status(404).json({ error: "Admin account not found." });
        }

        if (adminUser.isBanned) {
            return res.status(403).json({ error: "Your account has been banned." });
        }

        req.admin = adminUser;
        next();
    } catch (error) {
        console.log("Auth middleware error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export default authMiddleware;
