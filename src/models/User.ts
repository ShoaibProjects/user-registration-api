import mongoose, { Document, Schema } from 'mongoose';

/**
 * User interface describing the shape of the User document.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePicture?: {
    data: Buffer;
    contentType: string;
  };
  isEmailVerified: boolean;
  emailToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mongoose schema for the User model.
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailToken: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.model<IUser>('User', UserSchema);
