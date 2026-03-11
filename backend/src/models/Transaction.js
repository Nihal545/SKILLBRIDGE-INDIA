const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { type: Number, required: true },
    bidsAdded: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
    },
    paymentId: { type: String }, // Razorpay Payment ID
    type: { type: String, enum: ['purchase', 'refund', 'bonus'], default: 'purchase' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
