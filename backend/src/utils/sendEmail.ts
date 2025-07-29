// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const sendEmail = async (to: string, otp: string) => {
//   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//     console.error('Missing EMAIL_USER or EMAIL_PASS in environment variables');
//     return;
//   }
  
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: "noreply@hdsupport.com",
//     to,
//     subject: 'Your OTP Code is ',
//     text: `Your OTP is successfully generated: ${otp}`,
//   });
// };

// export default sendEmail;


import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to: string, otp: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Missing EMAIL_USER or EMAIL_PASS in environment variables');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background: #f3f4f6; padding: 40px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); padding: 20px; color: white; text-align: center;">
          <h2 style="margin: 0;">🔐 OTP Verification</h2>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 16px; color: #333;">Hi there,</p>
          <p style="font-size: 15px; color: #555;">Your one-time password (OTP) is:</p>
          <div style="font-size: 28px; font-weight: bold; margin: 20px auto; color: #4f46e5;">${otp}</div>
          <p style="font-size: 14px; color: #888;">This OTP is valid for only 5 minutes.</p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 13px; color: #aaa;">If you didn’t request this, please ignore this email.</p>
        </div>
      </div>
    </div>
  `;

  const textContent = `Your OTP is: ${otp}. It is valid for 5 minutes.\nIf you did not request this, you can safely ignore this email.`;

  try {
    await transporter.sendMail({
      from: `"Secure Login" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your OTP Code',
      html: htmlContent,
      text: textContent, // fallback for email clients that don't support HTML
    });

    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
  }
};

export default sendEmail;
