# 🤝 Collaborator Quick Start Guide

Welcome! This guide will help you get started with The Torch backend development.

## 🎯 What's Ready for You

The project now has a **complete file upload system** ready for backend integration:

✅ Frontend components (React/TypeScript)
✅ Backend API endpoints (Node.js/Express)
✅ Database models (MongoDB/Mongoose)
✅ File storage system
✅ Security and validation
✅ Complete documentation

## 🚀 Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Navigate to backend
cd back

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 2. Configure Environment

Edit `back/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/farmdialogue
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# Email (optional for now)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 3. Start MongoDB

```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongodb
# or
brew services start mongodb-community
```

### 4. Start Backend Server

```bash
cd back
npm run dev
```

You should see:
```
The Torch backend running on port 5000
Environment: development
MongoDB connected successfully
```

### 5. Test the API

```bash
# Health check
curl http://localhost:5000/health

# Should return:
# {"status":"ok","message":"The Torch backend is running","timestamp":"..."}
```

## 📁 Project Structure

```
farmdialogue/
├── back/                          # YOUR WORKSPACE
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── fileController.js  # File upload logic ✅
│   │   │   ├── userController.js  # User profiles ✅
│   │   │   ├── productController.js # Products ✅
│   │   │   └── authController.js  # Authentication ✅
│   │   ├── models/
│   │   │   ├── File.js            # File metadata ✅
│   │   │   ├── User.js            # Users ✅
│   │   │   ├── Product.js         # Products ✅
│   │   │   └── Message.js         # Messages ✅
│   │   ├── routes/
│   │   │   ├── files.js           # File routes ✅
│   │   │   ├── users.js           # User routes ✅
│   │   │   └── products.js        # Product routes ✅
│   │   └── app.js                 # Express setup ✅
│   ├── uploads/                   # File storage
│   │   ├── profile/
│   │   ├── product/
│   │   ├── message/
│   │   └── document/
│   ├── package.json
│   ├── server.js
│   ├── README.md                  # Backend docs
│   └── FILE_UPLOAD_SETUP.md       # Upload system docs
├── src/                           # Frontend (already done)
├── BACKEND_INTEGRATION.md         # Integration guide
├── FILE_UPLOAD_COMPLETE.md        # Complete overview
└── COLLABORATOR_GUIDE.md          # This file
```

## 🎯 Your Tasks

### Immediate (This Week)

1. **Test File Upload Endpoints**
   ```bash
   # See back/FILE_UPLOAD_SETUP.md for examples
   curl -X POST http://localhost:5000/api/files/upload \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TOKEN" \
     -d @test-upload.json
   ```

2. **Verify Database Models**
   - Check MongoDB collections
   - Test CRUD operations
   - Verify relationships

3. **Test with Frontend**
   - Start frontend: `npm run dev`
   - Test product image upload
   - Test profile picture upload

### Short Term (Next 2 Weeks)

1. **Optimize File Storage**
   - Implement image compression
   - Add thumbnail generation
   - Consider cloud storage (AWS S3, Cloudinary)

2. **Add Features**
   - Batch file uploads
   - Progress tracking
   - File metadata extraction

3. **Improve Security**
   - Add virus scanning
   - Implement rate limiting
   - Add file encryption

### Long Term (Next Month)

1. **Cloud Integration**
   - AWS S3 or Cloudinary
   - CDN setup
   - Backup strategy

2. **Performance**
   - Image optimization
   - Caching strategy
   - Database indexing

3. **Monitoring**
   - Error tracking
   - Usage analytics
   - Performance metrics

## 📚 Documentation

### Essential Reading

1. **BACKEND_INTEGRATION.md** - Complete integration guide
2. **back/FILE_UPLOAD_SETUP.md** - File upload system docs
3. **back/README.md** - Backend overview
4. **FILE_UPLOAD_COMPLETE.md** - Project overview

### API Documentation

All endpoints are documented in:
- `back/README.md` - Quick reference
- `BACKEND_INTEGRATION.md` - Detailed specs
- Inline code comments

## 🧪 Testing

### Manual Testing

```bash
# 1. Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+233201234567",
    "role": "farmer",
    "password": "password123"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Save the token from response

# 3. Upload file
curl -X POST http://localhost:5000/api/files/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": "USER_ID",
    "fileName": "test.jpg",
    "fileSize": 245632,
    "fileType": "image/jpeg",
    "fileData": "BASE64_DATA",
    "purpose": "product"
  }'
```

### Using Postman

1. Import collection from `back/postman_collection.json` (create if needed)
2. Set environment variables
3. Test all endpoints

### Integration Testing

```bash
# Start both servers
cd back && npm run dev &
npm run dev

# Open browser
http://localhost:5173

# Test file upload through UI
```

## 🔧 Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- MongoDB for VS Code
- REST Client
- GitLens

### Useful Commands

```bash
# Backend
cd back
npm run dev          # Start with nodemon
npm start            # Production mode
node seed-admin.js   # Seed admin user

# Frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
mongosh              # MongoDB shell
mongosh --eval "db.stats()"  # Check DB stats
```

## 🐛 Troubleshooting

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
mongosh

# If not, start it
mongod

# Or on Mac
brew services start mongodb-community
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 PID
```

### File Upload Fails

1. Check uploads directory exists: `ls back/uploads`
2. Check permissions: `chmod 755 back/uploads`
3. Check file size limit in `back/src/app.js`
4. Verify base64 encoding is correct

### CORS Errors

1. Check `FRONTEND_URL` in `.env`
2. Verify CORS config in `back/src/app.js`
3. Check browser console for details

## 💡 Tips

### Best Practices

1. **Always test locally first**
2. **Use meaningful commit messages**
3. **Document your changes**
4. **Write tests for new features**
5. **Follow existing code style**

### Code Style

```javascript
// Use async/await
const result = await Model.find();

// Handle errors properly
try {
  // code
} catch (error) {
  console.error('Error:', error);
  return res.status(500).json({ error: 'Message' });
}

// Use descriptive variable names
const userProfilePicture = await uploadFile(file);
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/your-feature

# Create pull request
```

## 🤝 Communication

### Questions?

- Check documentation first
- Search existing issues
- Ask in team chat
- Create GitHub issue

### Reporting Issues

Include:
1. What you were trying to do
2. What happened
3. Error messages
4. Steps to reproduce
5. Your environment (OS, Node version, etc.)

## 📊 Progress Tracking

### Week 1 Checklist

- [ ] Setup development environment
- [ ] Test all API endpoints
- [ ] Verify file upload works
- [ ] Test with frontend
- [ ] Review code structure

### Week 2 Checklist

- [ ] Implement image compression
- [ ] Add thumbnail generation
- [ ] Optimize database queries
- [ ] Add error logging
- [ ] Write tests

### Week 3 Checklist

- [ ] Cloud storage integration
- [ ] CDN setup
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation update

## 🎉 Success Criteria

You'll know you're on track when:

✅ Backend starts without errors
✅ All API endpoints respond correctly
✅ File uploads work from frontend
✅ Images display in the app
✅ Database operations are fast
✅ No security vulnerabilities
✅ Code is well-documented

## 📞 Support

- **Documentation:** See files listed above
- **Code Examples:** Check existing controllers
- **API Reference:** BACKEND_INTEGRATION.md
- **Team Chat:** [Your team communication channel]

## 🚀 Next Steps

1. ✅ Read this guide
2. ✅ Setup development environment
3. ✅ Test file upload endpoints
4. ✅ Review existing code
5. ⏳ Start implementing features
6. ⏳ Write tests
7. ⏳ Deploy to staging

---

**Welcome to the team! Let's build something amazing! 🌟**

**Last Updated:** April 28, 2026
**Status:** Ready for Development
