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
                verified: true
            });

            await adminUser.save();
            console.log(`Default Admin Account Created! Email: ${adminEmail}`);
        } else {
            // Uncomment to reset role if needed
            // adminExists.role = 'admin';
            // await adminExists.save();
            console.log(`Admin account already exists: ${adminEmail}`);
        }
    } catch (error) {
        console.error('Error seeding admin account:', error.message);
    }
};

module.exports = seedAdmin;
