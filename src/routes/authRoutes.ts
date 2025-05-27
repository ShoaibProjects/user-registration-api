import express from 'express';
import multer from 'multer';
import { registerUser, verifyEmail } from '../controllers/authController';
import { getAllUsers } from '../controllers/userController';

const router = express.Router();

// Multer setup using in-memory storage for quick access to file buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route   POST /api/register
 * @desc    Register a new user with profile picture upload
 * @access  Public
 */
router.post('/register', upload.single('profilePicture'), registerUser);

/**
 * @route   GET /api/users
 * @desc    Retrieve all users (basic listing)
 * @access  Public or Protected (if needed)
 */
router.get('/users', getAllUsers);

/**
 * @route   GET /api/verify-email
 * @desc    Verifies user email using a token from the email link
 * @access  Public
 */
router.get('/verify-email', verifyEmail);

export default router;
