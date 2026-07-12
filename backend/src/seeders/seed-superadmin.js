/**
 * Super Admin Seeder Script
 * 
 * Run this once to create the super admin account:
 *   node src/seeders/seed-superadmin.js
 * 
 * Credentials are read from .env:
 *   SUPER_ADMIN_EMAIL   – login email
 *   SUPER_ADMIN_PASSWORD – login password
 */

import env from 'dotenv';
env.config();
import bcrypt from 'bcrypt';
import db from '../config/db.js';
import Admin from '../modules/admin/models/admin.model.js';

const email = process.env.SUPER_ADMIN_EMAIL;
const password = process.env.SUPER_ADMIN_PASSWORD;

if (!email || !password) {
    console.error('❌ Missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD in .env');
    process.exit(1);
}

(async () => {
    try {
        await db.dbConnection();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.sequelize.sync({ alter: true });
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // Check if super admin already exists
        const existing = await Admin.findOne({ where: { role: 'super_admin' } });
        if (existing) {
            console.log('✅ Super admin already exists:');
            console.log(`   Email: ${existing.email}`);
            console.log('   Skipping creation.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
            email,
            password: hashedPassword,
            role: 'super_admin',
            isVerified: true,
            isApproved: true,
            isBanned: false
        });

        console.log('✅ Super admin created successfully!');
        console.log('   Login credentials:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to seed super admin:', error.message);
        process.exit(1);
    }
})();
