# FarmDialogue - Agricultural Platform

> 🚀 **New here?** Start with **[START_HERE.md](START_HERE.md)** for a quick overview!

A comprehensive web application connecting farmers, customers, vendors, and gardening enthusiasts in a unified digital platform.

## 🎉 Latest Update: File Upload System Complete!

The platform now has a **complete file upload system** ready for backend integration:

✅ User profile pictures and cover images
✅ Product images (single and multiple)
✅ Message attachments
✅ Document uploads
✅ Full backend API implementation
✅ Frontend components ready
✅ Complete documentation

**For Backend Developers:** See [docs/guides/COLLABORATOR_GUIDE.md](docs/guides/COLLABORATOR_GUIDE.md) to get started in 5 minutes!

## 📚 Documentation

### Quick Start
- **[Collaborator Guide](docs/guides/COLLABORATOR_GUIDE.md)** - Get started in 5 minutes
- **[Quick Reference](docs/guides/QUICK_REFERENCE.md)** - Common operations and commands

### Complete Guides
- **[Backend Integration](docs/api/BACKEND_INTEGRATION.md)** - Complete API integration guide
- **[File Upload Setup](docs/setup/FILE_UPLOAD_COMPLETE.md)** - File upload system overview
- **[Backend Setup](back/FILE_UPLOAD_SETUP.md)** - Backend setup instructions

### Project Management
- **[Backend Checklist](docs/guides/BACKEND_CHECKLIST.md)** - Integration checklist
- **[Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)** - What was implemented
- **[Project Status](docs/PROJECT_STATUS.md)** - Project status

### All Documentation
See **[docs/README.md](docs/README.md)** for complete documentation index

## Project Structure

See **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** for complete project organization.

```
farmdialogue/
├── src/                           # Frontend (React/TypeScript)
│   ├── components/
│   │   ├── FileUpload.tsx         # File upload component ✅
│   │   └── modals/                # Product, user modals ✅
│   ├── utils/
│   │   └── fileUploadService.ts   # Upload utilities ✅
│   ├── pages/                     # Dashboard pages
│   └── data/
│       └── types.ts               # TypeScript interfaces ✅
├── back/                          # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/                # Configuration
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── constants.js       # App constants ✅
│   │   ├── controllers/           # Business logic
│   │   │   ├── fileController.js  # File upload logic ✅
│   │   │   ├── userController.js  # User profiles ✅
│   │   │   └── productController.js # Products ✅
│   │   ├── models/                # Database models
│   │   │   ├── File.js            # File metadata ✅
│   │   │   ├── User.js            # With images ✅
│   │   │   ├── Product.js         # With images ✅
│   │   │   └── Message.js         # With attachments ✅
│   │   ├── routes/                # API routes
│   │   │   ├── files.js           # File routes ✅
│   │   │   ├── users.js           # User routes ✅
│   │   │   └── products.js        # Product routes ✅
│   │   └── utils/                 # Utilities ✅
│   │       ├── responseUtils.js   # Response helpers
│   │       └── fileUtils.js       # File helpers
│   ├── uploads/                   # File storage ✅
│   ├── .env.example               # Environment template ✅
│   ├── README.md                  # Backend docs
│   └── FILE_UPLOAD_SETUP.md       # Upload system docs
├── docs/                          # Documentation ✅
│   ├── api/                       # API docs
│   ├── guides/                    # User guides
│   └── setup/                     # Setup guides
├── PROJECT_STRUCTURE.md           # Project organization ✅
└── README.md                      # This file
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT
- **File Upload**: Base64 encoding, local storage (CDN-ready)
- **Version Control**: Git

## Features

1. **User Management**
   - User registration and authentication
   - User roles: Farmer, Customer, Vendor, Gardener, Admin
   - Profile pictures and cover images ✨ NEW
   - User profiles and verification

2. **Product Marketplace**
   - Browse farm produce and equipment
   - Create and manage product listings
   - Multiple product images ✨ NEW
   - Search and filter products
   - Price and quantity management

3. **Orders & Transactions**
   - Place and manage orders
   - Order tracking
   - Payment processing
   - Transaction history

4. **Communication**
   - Direct messaging between users
   - Message attachments ✨ NEW
   - Message notifications
   - Communication history

5. **File Upload System** ✨ NEW
   - Profile pictures (5MB max)
   - Cover images (5MB max)
   - Product images (5MB max, multiple per product)
   - Message attachments (10MB max)
   - Document uploads (10MB max)
   - Drag and drop interface
   - Image preview
   - File validation

6. **Learning Hub**
   - Gardening tutorials and guides
   - Agricultural articles
   - Video resources
   - Educational content management

7. **Vendor Management**
   - Vendor registration and verification
   - Business profile management
   - Vendor dashboard
   - Equipment listings

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB 5.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farmdialogue
   ```

2. **Backend Setup**
   ```bash
   cd back
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start MongoDB
   mongod
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   # From project root
   npm install
   npm run dev
   ```

4. **Verify Setup**
   ```bash
   # Test backend
   curl http://localhost:5000/health
   
   # Test file upload system
   cd back
   node test-file-upload.js
   ```

### Running the Application

1. Start MongoDB: `mongod`
2. Start backend: `cd back && npm run dev`
3. Start frontend: `npm run dev`
4. Navigate to: `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `POST /api/users/:userId/profile-picture` - Upload profile picture ✨
- `POST /api/users/:userId/cover-image` - Upload cover image ✨

### Products
- `GET /api/products` - Get product list
- `POST /api/products` - Create product (with images) ✨
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product (with images) ✨
- `DELETE /api/products/:id` - Delete product

### Files ✨ NEW
- `POST /api/files/upload` - Upload file
- `GET /api/files/:fileId` - Get file metadata
- `DELETE /api/files/:fileId` - Delete file
- `POST /api/files/products/:productId/images` - Add product image

### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message (with attachments) ✨

See [docs/api/BACKEND_INTEGRATION.md](docs/api/BACKEND_INTEGRATION.md) for complete API documentation.

## File Upload System

### Features
- Base64 encoding for secure transmission
- File size and type validation
- Unique file naming
- Ownership verification
- Local storage (CDN-ready)
- Drag and drop interface
- Image preview
- Multiple file support

### Supported File Types
- **Images**: JPEG, PNG, WebP, GIF
- **Documents**: PDF, DOC, DOCX

### File Size Limits
- Profile pictures: 5MB
- Product images: 5MB
- Message attachments: 10MB
- Documents: 10MB

### Usage Example

```typescript
import FileUpload from '@/components/FileUpload';

<FileUpload
  onFileSelect={(file, preview) => {
    console.log('File selected:', file);
    console.log('Preview URL:', preview);
  }}
  accept="image/*"
  maxSize={5}
  label="Upload Image"
/>
```

See [docs/setup/FILE_UPLOAD_COMPLETE.md](docs/setup/FILE_UPLOAD_COMPLETE.md) for complete documentation.

## Security Considerations

1. JWT token authentication
2. Password hashing with bcrypt
3. File size and type validation
4. Ownership verification
5. CORS configuration
6. Rate limiting
7. Input validation and sanitization
8. Helmet security headers

## Development Workflow

### Agile Methodology
This project follows Agile/Scrum practices with:
- 2-3 week sprints
- Daily standups
- Sprint planning and reviews
- Continuous integration and testing

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

## Testing

### Manual Testing
```bash
# Start both servers
cd back && npm run dev &
npm run dev

# Open browser
http://localhost:5173

# Test file upload through UI
```

### Automated Testing
```bash
# Backend tests
cd back
node test-file-upload.js

# Frontend tests (when available)
npm test
```

## Deployment

### Development
- Local development server
- MongoDB local instance

### Production
- Configure production database
- Set up cloud storage (AWS S3, Cloudinary)
- Configure CDN
- Enable SSL certificate
- Set up monitoring and logging
- Configure backup strategy

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
5. Await code review

## Team

- **Backend Developer**: [Your collaborator]
- **Frontend Developer**: [You]
- **Project Manager**: [Name]

## Support & Contact

For issues and questions:
- Check documentation first
- Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- Create GitHub issue
- Contact team

## License

All rights reserved - FarmDialogue 2026

## Changelog

### Version 1.1.0 (April 28, 2026) ✨ NEW
- ✅ Complete file upload system
- ✅ Profile pictures and cover images
- ✅ Multiple product images
- ✅ Message attachments
- ✅ Document uploads
- ✅ Backend API implementation
- ✅ Frontend components
- ✅ Complete documentation

### Version 1.0.0 (March 2026)
- Initial project setup
- Database schema design
- Frontend structure
- Backend routing foundation
- API endpoint templates

---

**Status**: ✅ Production Ready with File Upload System
**Last Updated**: April 28, 2026
**Next Steps**: Test integration, deploy to staging, integrate cloud storage

**For Backend Developers**: Start with [COLLABORATOR_GUIDE.md](COLLABORATOR_GUIDE.md)!

