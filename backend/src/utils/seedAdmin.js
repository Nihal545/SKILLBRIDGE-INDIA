const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@skillbridge.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const adminUser = new User({
                name: 'Super Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                verified: true,
                bids: 999999
            });

            await adminUser.save();
            console.log(`✅ Default Admin Account Created! Email: ${adminEmail} | Password: ${adminPassword}`);
        } else {
            // Always enforce admin role and verified status (in case DB was manually edited)
            adminExists.role = 'admin';
            adminExists.verified = true;
            adminExists.bids = 999999;
            await adminExists.save();
            console.log(`✅ Admin account verified: ${adminEmail}`);
        }
    } catch (error) {
        console.error('Error seeding admin account:', error.message);
    }
};

module.exports = seedAdmin;
