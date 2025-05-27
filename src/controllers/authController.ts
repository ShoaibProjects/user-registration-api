import { Request, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import { sendConfirmationEmail } from '../utils/email';

// Validation middleware for registration input
export const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Registration handler
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Email already taken.' }); // 409 Conflict
      return;
    }

    // Check for uploaded profile picture
    if (!req.file) {
      res.status(400).json({ message: 'Missing required field: profilePicture' });
      return;
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const emailToken = crypto.randomBytes(32).toString('hex');

    // Create new user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePicture: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      emailToken,
      isEmailVerified: false,
    });

    // Send confirmation email asynchronously (but await to handle errors)
    await sendConfirmationEmail(email, emailToken);

    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

// Validation middleware for email verification query param
export const validateVerifyEmail = [
  query('token').notEmpty().withMessage('Token is required'),
];

// Email verification handler
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  // Validate express-validator results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send(errors.array().map(e => e.msg).join(', '));
    return;
  }

  const token = req.query.token as string;

  try {
    // Find user by emailToken
    const user = await User.findOne({ emailToken: token });

    if (!user) {
      res.status(400).send('Invalid token or email already verified.');
      return;
    }

    // Verify user email and clear token
    user.emailToken = undefined;
    user.isEmailVerified = true;
    await user.save();

    // Redirect to a verification success page or send JSON response
    res.redirect('/verify.html');
  } catch (error) {
    console.error('Email Verification Error:', error);
    res.status(500).send('Internal server error. Please try again later.');
  }
};
