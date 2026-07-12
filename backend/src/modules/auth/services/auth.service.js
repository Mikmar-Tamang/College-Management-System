import admin from '../../admin/models/admin.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../../../services/email.service.js';
import { Op } from 'sequelize';
import { getIO } from '../../../config/socket.js';

const verificationToken = () => {
    return crypto.randomBytes(32).toString("hex");
}

const adminRegister = async (registerData) => {

    const token = verificationToken();

    const verificationLink = (token) => {
        return `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    }

    const link = verificationLink(token);
    try {
        const { password, collegeEmail, collegeName, collegeCode, collegeAddress, collegePhoneNumber, admin_name, phone_number } = registerData;
        const email = registerData.email.trim().toLowerCase();

        const sendVerificationEmail = async () => {
            try {
                await sendEmail(
                    email,
                    "Verify your account",
                    `<h2>Welcome ${admin_name}</h2>
            <p>Click below to verify your email:</p>
            <button><a href="${link}">Verify Email</a></button>`
                )
            } catch (err) {
                console.log(err, "email sending error")
                throw err
            }
        }

        const alreadyExits = await admin.findOne({ where: { email } });

        if (alreadyExits) {
            if (alreadyExits.isBanned) {
                throw new Error("Your account has been banned");
            } else if (alreadyExits.isVerified) {
                throw new Error("Admin with this email already exists");
            }

            // Resend verification
            alreadyExits.verificationToken = token;
            alreadyExits.password = await bcrypt.hash(password, 10);
            alreadyExits.verificationTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);
            alreadyExits.collegeName = collegeName;
            alreadyExits.collegeEmail = collegeEmail;
            alreadyExits.collegeCode = collegeCode;
            alreadyExits.collegeAddress = collegeAddress;
            alreadyExits.collegePhoneNumber = collegePhoneNumber;
            alreadyExits.admin_name = admin_name;
            alreadyExits.phone_number = phone_number;

            await alreadyExits.save();

            await sendVerificationEmail();

            return { success: true, meesage: "Verification email resend", email: email };
        }

        //  New User
        const hash = await bcrypt.hash(password, 10);

        const newAdmin = await admin.create({
            admin_name,
            email,
            password: hash,
            phone_number,
            verificationToken: token,
            verificationTokenExpiry: new Date(Date.now() + 1000 * 60 * 60),
            isVerified: false,
            collegeName,
            collegeAddress,
            collegeCode,
            collegeEmail,
            collegePhoneNumber,
            isBanned: false
        });

        await sendVerificationEmail();

        return { success: true, message: "Check your email to verify account", email: email };
    } catch (error) {
        throw error;
    }
};

const emailVerify = async (token) => {

    const adminUser = await admin.findOne({
        where: {
            verificationToken: token,
            verificationTokenExpiry: { [Op.gt]: new Date() }
        }
    });

    if (!adminUser) {
        const err = new Error("Invalid or expired link")
        err.status = 400;
        throw err;
    }

    adminUser.isVerified = true;
    adminUser.verificationToken = null;
    adminUser.verificationTokenExpiry = null;

    await adminUser.save();

    // If the admin is not a super_admin and not yet approved, 
    // emit socket notification to super admin and return pending flag
    if (adminUser.role !== 'super_admin' && !adminUser.isApproved) {
        // Notify super admin via socket
        try {
            const io = getIO();
            io.emit('new-registration', {
                id: adminUser.id,
                admin_name: adminUser.admin_name,
                collegeName: adminUser.collegeName,
                collegeEmail: adminUser.collegeEmail,
                email: adminUser.email,
                message: `New college registration: ${adminUser.collegeName} by ${adminUser.admin_name}`,
                timestamp: new Date()
            });
        } catch (socketErr) {
            console.log("Socket emit error (non-critical):", socketErr.message);
        }
        return { pendingApproval: true };
    }

    return { pendingApproval: false };
}

const adminLogin = async (loginEmail, password) => {
    try {
        const emailNormalize = loginEmail.trim().toLowerCase();

        // Try to find by collegeEmail first (for college admins), then by email (for super admin)
        let adminUser = await admin.findOne({ where: { collegeEmail: emailNormalize } });

        if (!adminUser) {
            // Try finding by the admin's personal email (super admin uses this)
            adminUser = await admin.findOne({ where: { email: emailNormalize } });
        }

        if (!adminUser) {
            throw new Error("Admin not found");
        }

        if (adminUser.isBanned) {
            throw new Error("Your Account has been banned");
        }

        if (!adminUser.isVerified) {
            throw new Error("Please verify your email first");
        }

        if (adminUser.role !== 'super_admin' && !adminUser.isApproved) {
            const err = new Error("Your account is pending approval by the super admin. Please wait.");
            err.status = 403;
            err.code = 'PENDING_APPROVAL';
            throw err;
        }

        const match = await bcrypt.compare(password, adminUser.password);
        if (!match) {
            throw new Error("Invalid email and password");
        }

        const token = jwt.sign({ id: adminUser.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        const adminObj = adminUser.toJSON();
        delete adminObj.password;
        return { admin: adminObj, token };
    } catch (error) {
        throw error;
    }
};

const forgotPassword = async (email) => {
    try {
        const emailNormalize = email.trim().toLowerCase();
        const adminUser = await admin.findOne({ where: { email: emailNormalize } });

        if (!adminUser) {
            return { success: true, message: "If an account exists with this email, a reset code has been sent" };
        }

        if (!adminUser.isVerified) {
            const err = new Error("This account is not verified. Please verify your email first.");
            err.status = 400;
            throw err;
        }

        if (adminUser.isBanned) {
            const err = new Error("This account has been banned.");
            err.status = 403;
            throw err;
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the code before storing
        const hashedCode = await bcrypt.hash(code, 10);

        adminUser.resetPasswordCode = hashedCode;
        adminUser.resetPasswordExpiry = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
        await adminUser.save();

        // Send code to admin's verified email
        await sendEmail(
            adminUser.email,
            "Password Reset Code",
            `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px; background: #1e293b; border-radius: 12px;">
                <h2 style="color: #ffffff; text-align: center; margin-bottom: 10px;">Password Reset</h2>
                <p style="color: #94a3b8; text-align: center;">Use the code below to reset your password. This code expires in 10 minutes.</p>
                <div style="background: #0f172a; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #3b82f6;">${code}</span>
                </div>
                <p style="color: #64748b; text-align: center; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            </div>`
        );

        return { success: true, message: "If an account exists with this email, a reset code has been sent" };
    } catch (error) {
        throw error;
    }
};

const verifyResetCode = async (email, code) => {
    try {
        const emailNormalize = email.trim().toLowerCase();
        const adminUser = await admin.findOne({ where: { email: emailNormalize } });

        if (!adminUser) {
            const err = new Error("Invalid email or code");
            err.status = 400;
            throw err;
        }

        if (!adminUser.resetPasswordCode || !adminUser.resetPasswordExpiry) {
            const err = new Error("No reset code was requested");
            err.status = 400;
            throw err;
        }

        if (new Date() > adminUser.resetPasswordExpiry) {
            const err = new Error("Reset code has expired. Please request a new one.");
            err.status = 400;
            throw err;
        }

        const match = await bcrypt.compare(code, adminUser.resetPasswordCode);
        if (!match) {
            const err = new Error("Invalid reset code");
            err.status = 400;
            throw err;
        }

        // Generate a short-lived JWT reset token (5 min)
        const resetToken = jwt.sign({ id: adminUser.id, purpose: "password-reset" }, process.env.JWT_SECRET, { expiresIn: "5m" });

        return { success: true, resetToken };
    } catch (error) {
        throw error;
    }
};

const resetPassword = async (resetToken, newPassword) => {
    try {
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (jwtErr) {
            const err = new Error("Reset session expired. Please start over.");
            err.status = 400;
            throw err;
        }

        if (decoded.purpose !== "password-reset") {
            const err = new Error("Invalid reset token");
            err.status = 400;
            throw err;
        }

        const adminUser = await admin.findByPk(decoded.id);
        if (!adminUser) {
            const err = new Error("Account not found");
            err.status = 404;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        adminUser.password = hashedPassword;
        adminUser.resetPasswordCode = null;
        adminUser.resetPasswordExpiry = null;
        await adminUser.save();

        return { success: true, message: "Password has been reset successfully" };
    } catch (error) {
        throw error;
    }
};

export default {
    adminRegister,
    adminLogin,
    emailVerify,
    forgotPassword,
    verifyResetCode,
    resetPassword
};