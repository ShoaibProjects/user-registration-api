import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure required environment variables are defined
const { EMAIL_USER, EMAIL_PASS, BASE_URL } = process.env;

if (!EMAIL_USER || !EMAIL_PASS || !BASE_URL) {
  throw new Error('❌ Missing required environment variables: EMAIL_USER, EMAIL_PASS, or BASE_URL');
}

// Create reusable transporter instance using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // TLS port
  secure: false, // Use TLS, not SSL
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  debug: true,   // Show debug logs
  logger: true,  // Log to console
});

/**
 * Sends an email confirmation message to the user with a verification link.
 * 
 * @param to - Recipient's email address
 * @param token - Unique email verification token
 * @returns Info about the sent message
 * @throws Error if sending fails
 */
export const sendConfirmationEmail = async (to: string, token: string) => {
  const verificationUrl = `${BASE_URL}/api/verify-email?token=${token}`;

  try {
    // Check SMTP connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Send the email
    const info = await transporter.sendMail({
      from: `"No Reply" <${EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email - Registration Confirmation',
      text: `Please confirm your email by visiting: ${verificationUrl}`,
      html: `
        <h2>Welcome!</h2>
        <p>Thank you for registering. Please confirm your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire soon. If you did not request this, please ignore this email.</p>
      `,
    });

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    throw new Error('Email sending failed. Please try again later.');
  }
};
