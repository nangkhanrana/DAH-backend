const asyncHandler = require('express-async-handler');
const Asset = require('../models/Asset');

// @desc    Get assets
// @route   GET /api/assets
// @access  Private
const getAssets = asyncHandler(async (req, res) => {
    const assets = await Asset.find({ user: req.user.id });
    res.status(200).json(assets);
});

// @desc    Set asset
// @route   POST /api/assets
// @access  Private
const setAsset = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.value) {
        res.status(400);
        throw new Error('Please add name and value fields');
    }

    const asset = await Asset.create({
        user: req.user.id,
        name: req.body.name,
        type: req.body.type,
        value: req.body.value,
        details: req.body.details,
        beneficiary: req.body.beneficiary,
        status: req.body.status || 'Active',
    });

    res.status(200).json(asset);
});

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private
const updateAsset = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
        res.status(404);
        throw new Error('Asset not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the asset user
    if (asset.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedAsset = await Asset.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json(updatedAsset);
});

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private
const deleteAsset = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
        res.status(404);
        throw new Error('Asset not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the asset user
    if (asset.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await asset.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getAssets,
    setAsset,
    updateAsset,
    deleteAsset,
};
