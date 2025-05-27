# User Registration API with MongoDB, Image Upload, and Email Verification

A robust and secure user registration API built with Node.js, Express.js, and MongoDB. This API provides complete user registration functionality with profile picture upload, email verification, and comprehensive error handling.

## 🚀 Features

- **User Registration**: Secure user registration with email and password
- **Profile Picture Upload**: Support for image upload with validation
- **Email Verification**: Automated email confirmation with verification tokens
- **Password Security**: Bcrypt hashing for secure password storage
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Handling**: Robust error handling with meaningful error messages
- **MongoDB Integration**: Efficient data storage with Mongoose ODM
- **RESTful Design**: Clean and intuitive API endpoints

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer for handling multipart/form-data
- **Email Service**: Nodemailer for email sending
- **Password Hashing**: Bcrypt for secure password storage
- **Validation**: Express-validator for input validation
- **Environment Management**: Dotenv for configuration

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **MongoDB** (v4.0 or higher) - Running locally or MongoDB Atlas
- **npm** (v6.0.0 or higher)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd user-registration-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

I directly provided the **.env** file in the codebase instead of putting it into *.gitignore*, so that no extra configuration effort is needed.

### 4. Start the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Register User

**Endpoint**: `POST /api/register`

**Description**: Register a new user with profile picture upload and email verification.

**Request Format**: `multipart/form-data`

**Parameters**:
- `name` (string, required): User's full name
- `email` (string, required): User's email address
- `password` (string, required): User's password (min 6 characters)
- `profilePicture` (file, optional): Profile picture (JPEG, PNG, GIF - max 2MB)

**Example Request using cURL**:
```bash
curl -X POST http://localhost:5000/api/register \
  -F "name=John Doe" \
  -F "email=john.doe@gmail.com" \
  -F "password=securepassword123" \
  -F "profilePicture=@/path/to/profile-picture.jpg"
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "profilePicture": "uploads/profiles/1686723456789-profile.jpg",
      "isVerified": false,
    }
  }
}
```

**Error Responses**:

**400 Bad Request** - Missing required fields:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**409 Conflict** - Email already exists:
```json
{
  "success": false,
  "message": "Email address is already registered"
}
```


## 📁 Project Structure

```
user-registration-api/
│
├── src/
│   ├── controllers/
│   │   ├── authController.ts      # User registration logic
│   │   └── userController         # To get list of registered users
│   ├── models/
│   │   └── User.ts                # User schema definition
│   ├── routes/
│   │   └── userRoutes.js          # API routes definition
│   ├── utils/
│   │   ├── email.ts               # Email sending utility
│   │   └── upload.ts              # File upload utilities
│   ├── config/
│   │    └── db.ts                 # MongoDB connection
│   └── server.js                  # Application entry point
│
├── public/
│   ├── index.html                 # Frontend
│   └── verify.html
│
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
├── package.json                   # Project dependencies
└── README.md                      # Project documentation
```

## 🔧 Configuration Details

### Email Service Setup

This API uses Nodemailer for sending verification emails. For Gmail:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password (not your regular password)
3. Use the App Password in the `EMAIL_PASS` environment variable

### File Upload Configuration

- **Supported formats**: JPEG, JPG, PNG, GIF
- **Maximum file size**: 2MB (configurable via `MAX_FILE_SIZE`)

### Database Schema

```TypeScript
{
  "name": {
    "type": "String",
    "required": true,
    "trim": true
  },
  "email": {
    "type": "String",
    "required": true,
    "unique": true,
    "trim": true,
    "lowercase": true,
    "index": true
  },
  "password": {
    "type": "String",
    "required": true
  },
  "profilePicture": {
    "data": {
      "type": "Buffer"
    },
    "contentType": {
      "type": "String"
    }
  },
  "isEmailVerified": {
    "type": "Boolean",
    "default": false
  },
  "emailToken": {
    "type": "String",
    "default": null
  },
  "createdAt": {
    "type": "Date",
    "default": "Automatically set by Mongoose timestamps"
  },
  "updatedAt": {
    "type": "Date",
    "default": "Automatically set by Mongoose timestamps"
  }
}

```

## 🧪 Testing the API

### Using Postman

1. Set request method to `POST`
2. URL: `http://localhost:5000/api/register`
3. In Body tab, select `form-data`
4. Add the following keys:
   - `name`: John Doe
   - `email`: john.doe@example.com
   - `password`: securepassword123
   - `profilePicture`: [Upload file]

### Using cURL

```bash
# Register user with profile picture
curl -X POST http://localhost:5000/api/register \
  -F "name=Jane Smith" \
  -F "email=jane.smith@gmail.com" \
  -F "password=mySecurePass123" \
  -F "profilePicture=@./test-image.jpg"
```

## 🚨 Error Handling

The API implements comprehensive error handling for:

- **Validation Errors**: Missing or invalid input data
- **Database Errors**: Connection issues, duplicate entries
- **File Upload Errors**: Invalid file types, size limits
- **Email Service Errors**: SMTP configuration issues
- **Server Errors**: Unexpected application errors

All errors return a consistent JSON format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Additional error details if applicable
}
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **Input Sanitization**: Protection against common injection attacks
- **File Type Validation**: Whitelist approach for allowed file types
- **File Size Limits**: Prevention of large file uploads
- **Email Verification**: Ensures valid email addresses
- **Error Information Limiting**: Prevents information leakage in error messages


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

**Shoaib Akhtar**
- Email: shoaibakhtarcs@gmail.com
- LinkedIn: [My LinkedIn Profile](https://www.linkedin.com/in/shoaib-akhtar-117329252/)
- GitHub: [My GitHub Profile](https://github.com/ShoaibProjects)

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- MongoDB team for the robust database solution
- Multer team for file upload handling
- Nodemailer team for email service integration

---

**Note**: This API is developed as part of a technical assessment for Backend Developer position. It demonstrates proficiency in Node.js, MongoDB, file handling, and email services.