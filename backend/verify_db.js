const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Job = require('./src/models/Job');

dotenv.config();

const verifyDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const freelancer = await User.findOne({ email: 'testfreelancer@example.com' });
        console.log('Freelancer Verified Status:', freelancer ? freelancer.verified : 'Not Found');
        console.log('Freelancer ID Verification Status:', freelancer ? freelancer.idVerification.status : 'N/A');

        const job = await Job.findOne({ title: 'Full Stack Web App' });
        console.log('Job Found:', job ? 'Yes' : 'No');
        if (job) {
            console.log('Job ID:', job._id);
            console.log('Client ID:', job.clientId);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

verifyDB();
