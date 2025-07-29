// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './config/db';
// import authRoutes from './routes/authRoutes';
// import noteRoutes from './routes/noteRoutes';
// import './config/googleStrategy'; // Must be done before using passport


// dotenv.config();
// connectDB();



// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/notes', noteRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';
import './config/googleStrategy'; // Load Passport Google Strategy

dotenv.config();
connectDB();

const app = express();

// Enable CORS for frontend (adjust origin in production)
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Middleware
app.use(express.json());

// Session (required for Passport even if JWT is used later)
app.use(
  session({
    secret: 'your_secret_key', // Replace with a secure secret in production
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
