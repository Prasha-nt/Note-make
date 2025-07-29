
// import express from 'express';
// import { sendOtp, verifyOtp ,resendOtp} from '../controller/AuthController';

// const router = express.Router();

// router.post('/send-otp', sendOtp);//to send otp
// router.post('/verify-otp', verifyOtp);// to verify otp
// router.post('/resend-otp', resendOtp);//to resend opt 

// export default router;


// src/routes/authRoutes.ts
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { sendOtp, verifyOtp, resendOtp } from '../controller/AuthController';

const router = express.Router();

// 🔐 OTP Routes
router.post('/send-otp', sendOtp);        // Send OTP
router.post('/verify-otp', verifyOtp);    // Verify OTP
router.post('/resend-otp', resendOtp);    // Resend OTP

// 🌐 Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req: any, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    res.redirect(`http://localhost:3000/auth/google/success?token=${token}`);
    // For production:
    // res.redirect(`https://your-frontend-domain.com/auth/google/success?token=${token}`);
  }
);

export default router;
