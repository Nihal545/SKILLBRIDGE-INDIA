const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    skills: [{ type: String }],
    clientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    bidsRequired: { type: Number, default: 5 },
    status: { 
        type: String, 
        enum: ['open', 'in-progress', 'completed', 'cancelled'], 
        default: 'open' 
    },
    urgent: { type: Boolean, default: false },
    premiumClient: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
