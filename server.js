const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/order'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
