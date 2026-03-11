const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['freelancer', 'client', 'admin'], 
        default: 'freelancer' 
    },
    bids: { type: Number, default: 20 },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    idVerification: {
        idType: { type: String, enum: ['Aadhaar', 'PAN', 'Passport'] },
        idNumberEncrypted: { type: String },
        documentImage: { type: String }, // Cloudinary URL
        status: { 
            type: String, 
            enum: ['none', 'pending', 'approved', 'rejected'], 
            default: 'none' 
        }
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
