const express = require('express');
const router = express.Router();
const {
    heartbeat,
    updateSettings,
    getTransfers,
    createTransfer,
    deleteTransfer,
} = require('../controllers/dmsController');
const { protect } = require('../middleware/authMiddleware');

router.post('/heartbeat', protect, heartbeat);
router.put('/settings', protect, updateSettings);
router.route('/transfers').get(protect, getTransfers).post(protect, createTransfer);
router.route('/transfers/:id').delete(protect, deleteTransfer);

module.exports = router;
