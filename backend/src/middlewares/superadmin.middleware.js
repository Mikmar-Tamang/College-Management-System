const superAdminMiddleware = (req, res, next) => {
    if (!req.admin) {
        return res.status(401).json({ error: "Authentication required." });
    }

    if (req.admin.role !== 'super_admin') {
        return res.status(403).json({ error: "Access denied. Super admin privileges required." });
    }

    next();
};

export default superAdminMiddleware;
