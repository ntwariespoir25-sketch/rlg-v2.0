require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import configs
const { connectDB } = require('./config/database.config');
const { errorMiddleware } = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');
const blogRoutes = require('./routes/blog.routes');
const programRoutes = require('./routes/program.routes');
const galleryRoutes = require('./routes/gallery.routes');
const eventRoutes = require('./routes/event.routes');
const getInvolvedRoutes = require('./routes/getinvolved.routes');
const contactRoutes = require('./routes/contact.routes');
const donationRoutes = require('./routes/donation.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const uploadRoutes = require('./routes/upload.routes');
const newsletterRoutes = require('./routes/newsletter.routes');

const app = express();

// Connect to Database
connectDB();

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// CORS middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
  }));

// Security middleware (with error handling)
try {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
} catch (err) {
  console.log('Helmet middleware error:', err.message);
}

// Compression middleware
try {
  app.use(compression());
} catch (err) {
  console.log('Compression middleware error:', err.message);
}

// Logging middleware (simplified)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use('/api/getinvolved', getInvolvedRoutes);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'RLG API is running',
    timestamp: new Date().toISOString()
  });
});
// Test endpoint to check admin existence
app.get('/api/test-admin', async (req, res) => {
  try {
    const Admin = require('./models/Admin.model');
    const admin = await Admin.findOne({ email: 'admin@rlg.org' });
    res.json({ 
      exists: !!admin, 
      admin: admin ? { email: admin.email, name: admin.name } : null 
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// API Routes - with error handling for each route
const routeGroups = [
  { path: '/api/auth', routes: authRoutes },
  { path: '/api/admin', routes: adminRoutes },
  { path: '/api/users', routes: userRoutes },
  { path: '/api/blogs', routes: blogRoutes },
  { path: '/api/programs', routes: programRoutes },
  { path: '/api/gallery', routes: galleryRoutes },
  { path: '/api/events', routes: eventRoutes },
  { path: '/api/contact', routes: contactRoutes },
  { path: '/api/donations', routes: donationRoutes },
  { path: '/api/testimonials', routes: testimonialRoutes },
  { path: '/api/dashboard', routes: dashboardRoutes },
  { path: '/api/upload', routes: uploadRoutes },
  { path: '/api/newsletter', routes: newsletterRoutes },
];

routeGroups.forEach(({ path, routes }) => {
  if (routes && typeof routes === 'function') {
    app.use(path, routes);
  } else if (routes && typeof routes === 'object') {
    app.use(path, routes);
  } else {
    console.log(`Warning: Route module for ${path} is invalid`);
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

// Error handling middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

module.exports = app;