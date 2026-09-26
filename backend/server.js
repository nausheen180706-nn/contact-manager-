const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const notFound = require('./middleware/notFoundMiddleware');
const errorHandler = require('./middleware/errorMiddleware');

// 1. Load environment variables
dotenv.config();

// 2. Connect to MongoDB database
connectDB();

// 3. Initialize Express application
const app = express();

// 4. Configure CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for webinar demo flexibility
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// 5. Enable body parsing for JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Health check endpoint (for UI status indicator and Postman)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Contact Manager API is running'
  });
});

// 7. Register API routes
app.use('/api/contacts', contactRoutes);

// 8. 404 Not Found Middleware
app.use(notFound);

// 9. Centralized Error Handling Middleware
app.use(errorHandler);

// 10. Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api/contacts`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = { app, server };
