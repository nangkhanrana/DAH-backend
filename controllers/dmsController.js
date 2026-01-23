const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Transfer = require('../models/Transfer');

// @desc    Record a heartbeat (check-in)
// @route   POST /api/dms/heartbeat
// @access  Private
const heartbeat = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { lastCheckIn: Date.now() },
        { new: true }
    );
    res.status(200).json({ lastCheckIn: user.lastCheckIn });
});

// @desc    Update DMS settings
// @route   PUT /api/dms/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
    const { inactivityThreshold } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { inactivityThreshold },
        { new: true }
    );
    res.status(200).json({ inactivityThreshold: user.inactivityThreshold });
});

// @desc    Get all transfers
// @route   GET /api/dms/transfers
// @access  Private
const getTransfers = asyncHandler(async (req, res) => {
    const transfers = await Transfer.find({ user: req.user.id })
        .populate('asset', 'name value')
        .populate('beneficiary', 'name email');
    res.status(200).json(transfers);
});

// @desc    Create a transfer
// @route   POST /api/dms/transfers
// @access  Private
const createTransfer = asyncHandler(async (req, res) => {
    const { assetId, beneficiaryId } = req.body;

    // Calculate trigger date based on user settings (simplified logic)
    // In a real scheduler, this would be updated dynamically
    const user = await User.findById(req.user.id);
    const triggerDate = new Date();
    triggerDate.setDate(triggerDate.getDate() + user.inactivityThreshold);

    const transfer = await Transfer.create({
        user: req.user.id,
        asset: assetId,
        beneficiary: beneficiaryId,
        triggerDate,
    });

    // Populate for return
    const populatedTransfer = await Transfer.findById(transfer._id)
        .populate('asset', 'name value')
        .populate('beneficiary', 'name email');

    res.status(201).json(populatedTransfer);
});

// @desc    Delete a transfer
// @route   DELETE /api/dms/transfers/:id
// @access  Private
const deleteTransfer = asyncHandler(async (req, res) => {
    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
        res.status(404);
        throw new Error('Transfer not found');
    }

    if (transfer.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await transfer.deleteOne();
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    heartbeat,
    updateSettings,
    getTransfers,
    createTransfer,
    deleteTransfer,
};
