import Admin from '../models/admin.model.js';
import Department from '../../department/models/department.model.js';
import Program from '../../program/models/program.model.js';
import Student from '../../student/models/student.model.js';
import FeePayment from '../../feePayment/models/feePayment.model.js';
import bcrypt from 'bcrypt';
import sendEmail from '../../../services/email.service.js';

const getAdminById = async (id) => {
    const adminUser = await Admin.findByPk(id, {
        attributes: {
            exclude: ['password', 'verificationToken', 'verificationTokenExpiry', 'resetPasswordCode', 'resetPasswordExpiry']
        }
    });

    if (!adminUser) {
        const err = new Error("Admin not found");
        err.status = 404;
        throw err;
    }

    return adminUser;
};

const updateProfile = async (id, { admin_name, email, phone_number }) => {
    const adminUser = await Admin.findByPk(id);
    if (!adminUser) {
        const err = new Error("Admin not found");
        err.status = 404;
        throw err;
    }

    // Check if email is already taken by another admin
    if (email && email !== adminUser.email) {
        const existing = await Admin.findOne({ where: { email } });
        if (existing) {
            const err = new Error("Email is already in use by another account");
            err.status = 409;
            throw err;
        }
    }

    if (admin_name) adminUser.admin_name = admin_name;
    if (email) adminUser.email = email;
    if (phone_number) adminUser.phone_number = phone_number;

    await adminUser.save();

    // Return without sensitive fields
    const updatedAdmin = await Admin.findByPk(id, {
        attributes: {
            exclude: ['password', 'verificationToken', 'verificationTokenExpiry', 'resetPasswordCode', 'resetPasswordExpiry']
        }
    });

    return updatedAdmin;
};

const changePassword = async (id, currentPassword, newPassword) => {
    const adminUser = await Admin.findByPk(id);
    if (!adminUser) {
        const err = new Error("Admin not found");
        err.status = 404;
        throw err;
    }

    const isMatch = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isMatch) {
        const err = new Error("Current password is incorrect");
        err.status = 400;
        throw err;
    }

    if (newPassword.length < 6) {
        const err = new Error("New password must be at least 6 characters");
        err.status = 400;
        throw err;
    }

    adminUser.password = await bcrypt.hash(newPassword, 10);
    await adminUser.save();

    return { success: true, message: "Password changed successfully" };
};

// ── Super Admin Functions ──

const getPendingAdmins = async () => {
    const pendingAdmins = await Admin.findAll({
        where: {
            isVerified: true,
            isApproved: false,
            role: 'college_admin'
        },
        attributes: {
            exclude: ['password', 'verificationToken', 'verificationTokenExpiry', 'resetPasswordCode', 'resetPasswordExpiry']
        },
        order: [['createdAt', 'DESC']]
    });

    return pendingAdmins;
};

const approveAdmin = async (adminId) => {
    const adminUser = await Admin.findByPk(adminId);
    if (!adminUser) {
        const err = new Error("Admin not found");
        err.status = 404;
        throw err;
    }

    if (adminUser.role === 'super_admin') {
        const err = new Error("Cannot approve a super admin");
        err.status = 400;
        throw err;
    }

    if (adminUser.isApproved) {
        const err = new Error("Admin is already approved");
        err.status = 400;
        throw err;
    }

    adminUser.isApproved = true;
    await adminUser.save();

    // Send approval email to the college admin
    try {
        await sendEmail(
            adminUser.email,
            "Your College Has Been Approved! 🎉",
            `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px; background: #1e293b; border-radius: 12px;">
                <h2 style="color: #ffffff; text-align: center; margin-bottom: 10px;">Congratulations! 🎉</h2>
                <p style="color: #94a3b8; text-align: center;">Hi ${adminUser.admin_name || 'Admin'},</p>
                <div style="background: #0f172a; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                    <p style="color: #4ade80; font-size: 18px; font-weight: bold;">Your college registration has been approved!</p>
                    <p style="color: #94a3b8; margin-top: 10px;">College: ${adminUser.collegeName}</p>
                </div>
                <p style="color: #94a3b8; text-align: center;">You can now log in to your account and start managing your college.</p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${process.env.FRONTEND_URL}" style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Login Now</a>
                </div>
            </div>`
        );
    } catch (emailErr) {
        console.log("Failed to send approval email:", emailErr.message);
    }

    const approvedAdmin = adminUser.toJSON();
    delete approvedAdmin.password;
    delete approvedAdmin.verificationToken;
    delete approvedAdmin.verificationTokenExpiry;
    delete approvedAdmin.resetPasswordCode;
    delete approvedAdmin.resetPasswordExpiry;

    return approvedAdmin;
};

const rejectAdmin = async (adminId) => {
    const adminUser = await Admin.findByPk(adminId);
    if (!adminUser) {
        const err = new Error("Admin not found");
        err.status = 404;
        throw err;
    }

    if (adminUser.role === 'super_admin') {
        const err = new Error("Cannot reject a super admin");
        err.status = 400;
        throw err;
    }

    await adminUser.destroy();

    return { success: true, message: "Admin registration rejected and removed" };
};

// ── Super Admin Dashboard Stats ──

const getDashboardStats = async () => {
    const totalColleges = await Admin.count({ where: { role: 'college_admin', isVerified: true } });
    const activeColleges = await Admin.count({ where: { role: 'college_admin', isVerified: true, isApproved: true, isBanned: false } });
    const bannedColleges = await Admin.count({ where: { role: 'college_admin', isBanned: true } });
    const pendingApprovals = await Admin.count({ where: { role: 'college_admin', isVerified: true, isApproved: false, isBanned: false } });

    return {
        totalColleges,
        activeColleges,
        bannedColleges,
        pendingApprovals
    };
};

// ── Get all approved colleges ──

const getAllColleges = async () => {
    const colleges = await Admin.findAll({
        where: {
            role: 'college_admin',
            isVerified: true,
            isApproved: true,
            isBanned: false
        },
        attributes: {
            exclude: ['password', 'verificationToken', 'verificationTokenExpiry', 'resetPasswordCode', 'resetPasswordExpiry']
        },
        order: [['createdAt', 'DESC']]
    });

    return colleges;
};

// ── Get banned colleges ──

const getBannedColleges = async () => {
    const colleges = await Admin.findAll({
        where: {
            role: 'college_admin',
            isBanned: true
        },
        attributes: {
            exclude: ['password', 'verificationToken', 'verificationTokenExpiry', 'resetPasswordCode', 'resetPasswordExpiry']
        },
        order: [['updatedAt', 'DESC']]
    });

    return colleges;
};

// ── Get college details (departments, programs, students, finance) ──

const getCollegeDetails = async (adminId) => {
    const college = await Admin.findByPk(adminId, {
        attributes: {
            exclude: ['password', 'verificationToken', 'verificationTokenExpiry', 'resetPasswordCode', 'resetPasswordExpiry']
        }
    });

    if (!college) {
        const err = new Error("College not found");
        err.status = 404;
        throw err;
    }

    if (college.role !== 'college_admin') {
        const err = new Error("Not a college admin");
        err.status = 400;
        throw err;
    }

    // Get college-specific stats
    // Note: In the current schema, departments/programs/students are global.
    // For a multi-tenant system, they'd be linked to adminId. 
    // For now we return global counts as a placeholder for the college's data.
    const departments = await Department.findAll({ where: { adminId: adminId } }).catch(() => []);
    const programs = await Program.findAll({ where: { adminId: adminId } }).catch(() => []);
    const students = await Student.findAll({ where: { adminId: adminId } }).catch(() => []);
    
    let totalFeeCollected = 0;
    let totalFeePending = 0;

    try {
        const feePayments = await FeePayment.findAll({ where: { adminId: adminId } });
        totalFeeCollected = feePayments
            .filter(p => p.status === 'Paid')
            .reduce((sum, p) => sum + (p.amount || 0), 0);
        totalFeePending = feePayments
            .filter(p => p.status !== 'Paid')
            .reduce((sum, p) => sum + (p.amount || 0), 0);
    } catch {
        // If adminId doesn't exist on FeePayment, just return 0
    }

    return {
        college: college.toJSON(),
        stats: {
            totalDepartments: departments.length,
            totalPrograms: programs.length,
            totalStudents: students.length,
            totalFeeCollected,
            totalFeePending,
            departments: departments.map(d => d.toJSON()),
            programs: programs.map(p => p.toJSON()),
        }
    };
};

// ── Ban a college ──

const banCollege = async (adminId) => {
    const adminUser = await Admin.findByPk(adminId);
    if (!adminUser) {
        const err = new Error("College admin not found");
        err.status = 404;
        throw err;
    }

    if (adminUser.role === 'super_admin') {
        const err = new Error("Cannot ban a super admin");
        err.status = 400;
        throw err;
    }

    if (adminUser.isBanned) {
        const err = new Error("College is already banned");
        err.status = 400;
        throw err;
    }

    adminUser.isBanned = true;
    await adminUser.save();

    return { success: true, message: `${adminUser.collegeName || 'College'} has been banned` };
};

// ── Unban a college ──

const unbanCollege = async (adminId) => {
    const adminUser = await Admin.findByPk(adminId);
    if (!adminUser) {
        const err = new Error("College admin not found");
        err.status = 404;
        throw err;
    }

    if (!adminUser.isBanned) {
        const err = new Error("College is not banned");
        err.status = 400;
        throw err;
    }

    adminUser.isBanned = false;
    await adminUser.save();

    return { success: true, message: `${adminUser.collegeName || 'College'} has been unbanned` };
};

export default {
    getAdminById,
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
