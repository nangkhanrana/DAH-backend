const express = require('express');
const router = express.Router();
const {
    getAssets,
    setAsset,
    updateAsset,
    deleteAsset,
} = require('../controllers/assetController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAssets).post(protect, setAsset);
router.route('/:id').put(protect, updateAsset).delete(protect, deleteAsset);

module.exports = router;
