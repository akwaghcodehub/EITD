import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// ✅ FORCE LOAD .ENV
dotenv.config({ path: path.join(__dirname, '../../.env') });
// ✅ ADD THESE DEBUG LOGS
console.log('=== EMAIL CONFIGURATION ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (hidden)' : '❌ NOT SET');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('==========================');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationToken: string
) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"Illini Lost & Found" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Illini Lost & Found Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #13294B;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #E84A27;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Illini Lost & Found</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for registering with Illini Lost & Found!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #E84A27;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>University of Illinois Urbana-Champaign</p>
            <p>Illini Lost & Found - CS409 Project</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email: string, name: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Illini Lost & Found!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #13294B;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Illini Lost & Found!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Your email has been verified successfully! 🎉</p>
            <p>You can now:</p>
            <ul>
              <li>Report lost items</li>
              <li>Report found items</li>
              <li>Browse and search items</li>
              <li>Claim items that belong to you</li>
            </ul>
            <p>Thank you for being part of our community!</p>
            <p><a href="${process.env.FRONTEND_URL}/login" style="color: #E84A27;">Login to get started</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
};