const asyncHandler = require('express-async-handler');
const Beneficiary = require('../models/Beneficiary');

// @desc    Get beneficiaries
// @route   GET /api/beneficiaries
// @access  Private
const getBeneficiaries = asyncHandler(async (req, res) => {
    const beneficiaries = await Beneficiary.find({ user: req.user.id });
    res.status(200).json(beneficiaries);
});

// @desc    Add beneficiary
// @route   POST /api/beneficiaries
// @access  Private
const addBeneficiary = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.relationship) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    const beneficiary = await Beneficiary.create({
        user: req.user.id,
        name: req.body.name,
        email: req.body.email,
        relationship: req.body.relationship,
        walletAddress: req.body.walletAddress,
        status: req.body.status || 'Pending',
    });

    res.status(200).json(beneficiary);
});

// @desc    Update beneficiary
// @route   PUT /api/beneficiaries/:id
// @access  Private
const updateBeneficiary = asyncHandler(async (req, res) => {
    const beneficiary = await Beneficiary.findById(req.params.id);

    if (!beneficiary) {
        res.status(404);
        throw new Error('Beneficiary not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the beneficiary user
    if (beneficiary.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json(updatedBeneficiary);
});

// @desc    Delete beneficiary
// @route   DELETE /api/beneficiaries/:id
// @access  Private
const deleteBeneficiary = asyncHandler(async (req, res) => {
    const beneficiary = await Beneficiary.findById(req.params.id);

    if (!beneficiary) {
        res.status(404);
        throw new Error('Beneficiary not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the beneficiary user
    if (beneficiary.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await beneficiary.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getBeneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
};
