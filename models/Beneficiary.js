const mongoose = require('mongoose');

const beneficiarySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
        },
        relationship: {
            type: String,
            required: [true, 'Please specify relationship'],
        },
        walletAddress: {
            type: String,
        },
        status: {
            type: String,
            default: 'Pending',
            enum: ['Pending', 'Verified'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
