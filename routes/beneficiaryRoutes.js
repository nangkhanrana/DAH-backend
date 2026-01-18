const express = require('express');
const router = express.Router();
const {
    getBeneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
} = require('../controllers/beneficiaryController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getBeneficiaries).post(protect, addBeneficiary);
router.route('/:id').put(protect, updateBeneficiary).delete(protect, deleteBeneficiary);

module.exports = router;
