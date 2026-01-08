const mongoose = require('mongoose');

const transferSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        asset: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Asset',
        },
        beneficiary: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Beneficiary',
        },
        status: {
            type: String,
            default: 'Scheduled',
            enum: ['Scheduled', 'Pending', 'Executed', 'Cancelled'],
        },
        triggerDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transfer', transferSchema);
