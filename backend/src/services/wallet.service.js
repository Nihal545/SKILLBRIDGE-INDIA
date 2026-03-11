const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * Service to handle bid purchases.
 * In production, this would verify Razorpay signatures.
 * For now, it uses dummy logic as requested.
 */
exports.processBidPurchase = async (userId, packageInfo, paymentId = 'dummy_pay_123') => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const transaction = await Transaction.create({
        userId,
        amount: packageInfo.price,
        bidsAdded: packageInfo.bids,
        status: 'completed',
        paymentId,
        type: 'purchase'
    });

    user.bids += packageInfo.bids;
    await user.save();

    return transaction;
};

exports.refundBids = async (userId, amount) => {
    return await User.findByIdAndUpdate(userId, { $inc: { bids: amount } });
};
