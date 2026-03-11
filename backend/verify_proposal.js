const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Proposal = require('./src/models/Proposal');

dotenv.config();

const verifyProposal = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const proposal = await Proposal.findOne().sort({ createdAt: -1 });
        if (proposal) {
            console.log('Final Proposal Found:');
            console.log('- Bid Amount:', proposal.bidAmount);
            console.log('- Cover Letter Snippet:', proposal.coverLetter.substring(0, 30) + '...');
            console.log('- Job ID:', proposal.jobId);
        } else {
            console.log('No proposals found.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

verifyProposal();
