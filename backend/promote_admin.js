const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const promoteToAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log(`Success: ${user.name} (${user.email}) is now an admin.`);
        } else {
            console.log(`Error: User with email ${email} not found.`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

const email = process.argv[2];
if (!email) {
    console.log('Usage: node promote_admin.js <email>');
    process.exit(1);
}

promoteToAdmin(email);
