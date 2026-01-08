const mongoose = require('mongoose');

const assetSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please add an asset name'],
        },
        type: {
            type: String,
            required: [true, 'Please add an asset type'],
        },
        value: {
            type: Number,
            required: [true, 'Please add the value'],
        },
        details: {
            type: String,
            required: [true, 'Please add asset details'],
        },
        status: {
            type: String,
            default: 'Active',
            enum: ['Active', 'Locked', 'Transferred'],
        },
        beneficiary: {
            type: String, // Storing name primarily as per frontend, could be ObjectId if rigorous linking needed
            required: [true, 'Please assign a beneficiary'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Asset', assetSchema);
