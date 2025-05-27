import { Request, Response } from 'express';
import User from '../models/User';

// Controller to get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all user documents from the database
    const users = await User.find();

    // Transform user data to exclude sensitive fields like password
    const userData = users.map(user => ({
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      // Convert image buffer to base64 string if profile picture exists
      profilePicture: user.profilePicture?.data
        ? {
            data: user.profilePicture.data.toString('base64'),
            contentType: user.profilePicture.contentType
          }
        : null
    }));

    // Send success response with user data
    res.status(200).json(userData);
  } catch (err) {
    // Log error and send server error response
    console.error('Failed to fetch users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
