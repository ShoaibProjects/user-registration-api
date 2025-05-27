import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

/**
 * Controller: Fetch all users with optional filter for email verification status.
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Optional query filter: ?isEmailVerified=true/false
    const isEmailVerifiedParam = req.query.isEmailVerified;
    const filter: Record<string, any> = {};

    if (isEmailVerifiedParam === 'true') {
      filter.isEmailVerified = true;
    } else if (isEmailVerifiedParam === 'false') {
      filter.isEmailVerified = false;
    }

    // Fetch all users that match filter
    const users = await User.find(filter);

    // Format and sanitize user data
    const userData = users.map(user => ({
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      profilePicture: user.profilePicture?.data
        ? {
            data: user.profilePicture.data.toString('base64'),
            contentType: user.profilePicture.contentType,
          }
        : null,
    }));

    // Return users list
    res.status(200).json({ data: userData, count: userData.length });
  } catch (err) {
    console.error('Failed to fetch users:', err);
    next(err); // Pass to error middleware
  }
};
