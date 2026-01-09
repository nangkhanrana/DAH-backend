const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Digital Asset Heirloom API is running',
        environment: process.env.NODE_ENV || 'development'
    });
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/beneficiaries', require('./routes/beneficiaryRoutes'));
app.use('/api/dms', require('./routes/dmsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
