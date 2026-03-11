/**
 * Calculates bids required for a job based on budget tiers:
 * - Up to ₹1,000: 2 Bids
 * - ₹1,001 - ₹5,000: 5 Bids
 * - ₹5,001 - ₹15,000: 10 Bids
 * - ₹15,001 - ₹50,000: 20 Bids
 * - Above ₹50,000: 50 Bids
 * 
 * Modifiers:
 * - Urgent: +2 Bids
 * - Premium Client: -1 Bid (Incentive for premium clients)
 */
const calculateBidsRequired = (jobData) => {
    let bids = 2;
    const budget = Number(jobData.budget) || 0;

    if (budget > 50000) {
        bids = 50;
    } else if (budget > 15000) {
        bids = 20;
    } else if (budget > 5000) {
        bids = 10;
    } else if (budget > 1000) {
        bids = 5;
    } else {
        bids = 2;
    }

    // Add urgency modifier
    if (jobData.urgent) {
        bids += 2;
    }

    // Adjust for premium clients
    if (jobData.premiumClient) {
        bids = Math.max(1, bids - 1);
    }

    return bids;
};

module.exports = calculateBidsRequired;
