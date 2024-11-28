const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
//whitelist my frontends

const allowedOrigins = [
    "http://localhost:3000",
    "https://shopease-frontend.onrender.com",
    
  ];
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); // Allow request
        } else {
          callback(new Error("Not allowed by CORS")); // Block request
        }
      },
    })
  );app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/order'));


// Serve static React frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve frontend build folder
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));

  // Catch-all route to serve React's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
