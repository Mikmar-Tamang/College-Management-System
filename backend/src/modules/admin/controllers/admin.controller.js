import adminService from '../services/admin.service.js';

const getMe = async (req, res) => {
    try {
        // req.admin is already set by the auth middleware (with sensitive fields excluded)
        res.status(200).json({ success: true, admin: req.admin });
    } catch (error) {
        console.log("getMe error:", error);
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { admin_name, email, phone_number } = req.body;
        const updatedAdmin = await adminService.updateProfile(req.admin.id, { admin_name, email, phone_number });
        res.status(200).json({ success: true, admin: updatedAdmin });
    } catch (error) {
        console.log("updateProfile error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current password and new password are required" });
        }
        const result = await adminService.changePassword(req.admin.id, currentPassword, newPassword);
        res.status(200).json(result);
    } catch (error) {
        console.log("changePassword error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const getPendingAdmins = async (req, res) => {
    try {
        const pendingAdmins = await adminService.getPendingAdmins();
        res.status(200).json({ success: true, data: pendingAdmins });
    } catch (error) {
        console.log("getPendingAdmins error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const approveAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const approvedAdmin = await adminService.approveAdmin(id);
        res.status(200).json({ success: true, message: "Admin approved successfully", admin: approvedAdmin });
    } catch (error) {
        console.log("approveAdmin error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const rejectAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminService.rejectAdmin(id);
        res.status(200).json(result);
    } catch (error) {
        console.log("rejectAdmin error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

// ── Super Admin Dashboard & College Management ──

const getDashboardStats = async (req, res) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.log("getDashboardStats error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const getAllColleges = async (req, res) => {
    try {
        const colleges = await adminService.getAllColleges();
        res.status(200).json({ success: true, data: colleges });
    } catch (error) {
        console.log("getAllColleges error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const getBannedColleges = async (req, res) => {
    try {
        const colleges = await adminService.getBannedColleges();
        res.status(200).json({ success: true, data: colleges });
    } catch (error) {
        console.log("getBannedColleges error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const getCollegeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const details = await adminService.getCollegeDetails(id);
        res.status(200).json({ success: true, data: details });
    } catch (error) {
        console.log("getCollegeDetails error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const banCollege = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminService.banCollege(id);
        res.status(200).json(result);
    } catch (error) {
        console.log("banCollege error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const unbanCollege = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminService.unbanCollege(id);
        res.status(200).json(result);
    } catch (error) {
        console.log("unbanCollege error:", error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

export default {
    getMe,
    updateProfile,
    changePassword,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin,
    getDashboardStats,
    getAllColleges,
    getBannedColleges,
    getCollegeDetails,
    banCollege,
    unbanCollege
};
