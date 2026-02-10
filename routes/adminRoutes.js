const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getAllAssets,
    getAllBeneficiaries,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.get('/assets', getAllAssets);
router.get('/beneficiaries', getAllBeneficiaries);

module.exports = router;
