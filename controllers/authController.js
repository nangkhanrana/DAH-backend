const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


const verifyPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    console.log(`[VerifyPassword] Attempt for user ${req.user.id}`);

    // Explicitly select password just to be 100% sure, though default behavior should include it
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
        console.log('[VerifyPassword] User not found');
        res.status(404);
        throw new Error('User not found');
    }

    const isMatch = await user.matchPassword(password);
    console.log(`[VerifyPassword] Password match result: ${isMatch}`);

    if (isMatch) {
        res.json({ success: true });
    } else {
        res.status(401);
        throw new Error('Invalid password');
    }
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    verifyPassword,
};
