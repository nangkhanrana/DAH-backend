const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Asset = require('../models/Asset');
const Beneficiary = require('../models/Beneficiary');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Get all assets
// @route   GET /api/admin/assets
// @access  Private/Admin
const getAllAssets = asyncHandler(async (req, res) => {
    const assets = await Asset.find({}).populate('user', 'name email');
    res.json(assets);
});

// @desc    Get all beneficiaries
// @route   GET /api/admin/beneficiaries
// @access  Private/Admin
const getAllBeneficiaries = asyncHandler(async (req, res) => {
    const beneficiaries = await Beneficiary.find({}).populate('user', 'name email');
    res.json(beneficiaries);
});

module.exports = {
    getAllUsers,
    getAllAssets,
    getAllBeneficiaries,
};
