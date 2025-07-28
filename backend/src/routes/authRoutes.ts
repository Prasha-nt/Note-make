// src/routes/authRoutes.ts
import express from 'express';
import passport from '../config/passport';
import { sendOtp, verifyOtp, resendOtp, googleAuthSuccess } from '../controller/AuthController';

const router = express.Router();

// Existing OTP routes
router.post('/send-otp', sendOtp);//to send otp
router.post('/verify-otp', verifyOtp);// to verify otp
router.post('/resend-otp', resendOtp);//to resend opt 

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?error=auth_failed` }),
  googleAuthSuccess
);

export default router;
