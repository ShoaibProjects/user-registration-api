import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// Allowed file types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

// Max file size (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

/**
 * Memory storage config for storing files in buffer
 */
const storage = multer.memoryStorage();

/**
 * File filter to validate image type
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('❌ Only .jpg and .png images are allowed.'));
  }
};

/**
 * Multer middleware to handle image uploads
 */
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export default upload;
