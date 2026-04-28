# 🚀 Quick Reference - File Upload System

## 📋 Table of Contents
- [Setup](#setup)
- [Common Operations](#common-operations)
- [API Endpoints](#api-endpoints)
- [Frontend Usage](#frontend-usage)
- [Troubleshooting](#troubleshooting)

---

## Setup

### Start Backend
```bash
cd back
npm install
npm run dev
```

### Start Frontend
```bash
npm install
npm run dev
```

### Test System
```bash
cd back
node test-file-upload.js
```

---

## Common Operations

### 1. Upload Product Image

**Frontend:**
```typescript
import { prepareBackendUpload, uploadFileToBackend } from '@/utils/fileUploadService';

const handleUpload = async (file: File) => {
  const payload = await prepareBackendUpload(file, userId, 'product');
  const result = await uploadFileToBackend(payload);
  
  if (result.success) {
    console.log('Uploaded:', result.data.fileUrl);
  }
};
```

**Backend API:**
```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "userId": "user-id",
    "fileName": "product.jpg",
    "fileSize": 245632,
    "fileType": "image/jpeg",
    "fileData": "base64-data",
    "purpose": "product"
  }'
```

### 2. Update Profile Picture

**Frontend:**
```typescript
const updateProfilePicture = async (file: File) => {
  const base64 = await fileToBase64(file);
  
  const response = await fetch(`${API_URL}/api/users/${userId}/profile-picture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      profilePicture: `data:${file.type};base64,${base64}`
    })
  });
};
```

**Backend API:**
```bash
curl -X POST http://localhost:5000/api/users/USER_ID/profile-picture \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"profilePicture": "data:image/jpeg;base64,..."}'
```

### 3. Add Multiple Product Images

**Frontend:**
```typescript
const uploadMultipleImages = async (files: File[]) => {
  const uploads = await Promise.all(
    files.map(file => prepareBackendUpload(file, userId, 'product'))
  );
  
  const results = await Promise.all(
    uploads.map(payload => uploadFileToBackend(payload))
  );
  
  const imageUrls = results
    .filter(r => r.success)
    .map(r => r.data.fileUrl);
  
  return imageUrls;
};
```

### 4. Delete File

**Frontend:**
```typescript
import { deleteFileFromBackend } from '@/utils/fileUploadService';

const handleDelete = async (fileId: string) => {
  const result = await deleteFileFromBackend(fileId);
  
  if (result.success) {
    console.log('File deleted');
  }
};
```

**Backend API:**
```bash
curl -X DELETE http://localhost:5000/api/files/FILE_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## API Endpoints

### File Operations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/files/upload | ✅ | Upload any file |
| GET | /api/files/:fileId | ❌ | Get file metadata |
| DELETE | /api/files/:fileId | ✅ | Delete file |

### User Operations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/users/:userId/profile-picture | ✅ | Upload profile picture |
| POST | /api/users/:userId/cover-image | ✅ | Upload cover image |

### Product Operations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/files/products/:productId/images | ✅ | Add product image |
| POST | /api/products | ✅ | Create product (with images) |
| PUT | /api/products/:id | ✅ | Update product (with images) |

---

## Frontend Usage

### FileUpload Component

```tsx
import FileUpload from '@/components/FileUpload';

<FileUpload
  onFileSelect={(file, preview) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
  }}
  accept="image/*"
  maxSize={5}
  label="Upload Image"
  preview={existingImageUrl}
/>
```

### File Validation

```typescript
import { validateFile, DEFAULT_IMAGE_CONFIG } from '@/utils/fileUploadService';

const validation = validateFile(file, DEFAULT_IMAGE_CONFIG);

if (!validation.valid) {
  toast.error(validation.error);
  return;
}
```

### Convert File to Base64

```typescript
import { fileToBase64 } from '@/utils/fileUploadService';

const base64 = await fileToBase64(file);
console.log(base64); // Base64 string without data URI prefix
```

---

## File Size Limits

| Purpose | Max Size | Allowed Types |
|---------|----------|---------------|
| Profile | 5MB | JPEG, PNG, WebP, GIF |
| Product | 5MB | JPEG, PNG, WebP, GIF |
| Message | 10MB | Images + PDF |
| Document | 10MB | PDF, DOC, DOCX |

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/farmdialogue
JWT_SECRET=your-secret-key
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
```

---

## Troubleshooting

### Server Not Starting

```bash
# Check if port is in use
lsof -i :5000

# Kill process
kill -9 PID

# Restart server
npm run dev
```

### MongoDB Connection Failed

```bash
# Start MongoDB
mongod

# Or on Mac
brew services start mongodb-community

# Check status
mongosh
```

### File Upload Fails

**Check file size:**
```typescript
console.log('File size:', file.size / (1024 * 1024), 'MB');
```

**Check file type:**
```typescript
console.log('File type:', file.type);
```

**Check uploads directory:**
```bash
ls -la back/uploads/
chmod 755 back/uploads/
```

### CORS Errors

**Update backend CORS config:**
```javascript
// back/src/app.js
const allowedOrigins = [
  'http://localhost:5173',  // Add your frontend URL
  'http://localhost:3000'
];
```

### Base64 Encoding Issues

**Verify encoding:**
```typescript
const base64 = await fileToBase64(file);
console.log('Base64 length:', base64.length);
console.log('First 50 chars:', base64.substring(0, 50));
```

---

## Testing

### Manual Test

```bash
# 1. Start backend
cd back && npm run dev

# 2. Start frontend
npm run dev

# 3. Open browser
http://localhost:5173

# 4. Test upload
Dashboard → Listings → Add Product → Upload Image
```

### Automated Test

```bash
cd back
node test-file-upload.js
```

### API Test with cURL

```bash
# Health check
curl http://localhost:5000/health

# Register user
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

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Common Patterns

### Upload with Progress

```typescript
const uploadWithProgress = async (file: File) => {
  const payload = await prepareBackendUpload(file, userId, 'product');
  
  // Show loading
  toast.loading('Uploading...');
  
  const result = await uploadFileToBackend(payload);
  
  if (result.success) {
    toast.success('Upload complete!');
    return result.data.fileUrl;
  } else {
    toast.error(result.error);
    return null;
  }
};
```

### Batch Upload

```typescript
const uploadBatch = async (files: File[]) => {
  const results = await Promise.all(
    files.map(async (file) => {
      const payload = await prepareBackendUpload(file, userId, 'product');
      return uploadFileToBackend(payload);
    })
  );
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`Uploaded: ${successful.length}, Failed: ${failed.length}`);
  
  return successful.map(r => r.data.fileUrl);
};
```

### Image Preview

```typescript
const [preview, setPreview] = useState<string | null>(null);

const handleFileSelect = (file: File, previewUrl: string) => {
  setPreview(previewUrl);
};

return (
  <div>
    <FileUpload onFileSelect={handleFileSelect} />
    {preview && <img src={preview} alt="Preview" />}
  </div>
);
```

---

## Useful Commands

```bash
# Backend
cd back
npm install              # Install dependencies
npm run dev              # Start dev server
npm start                # Start production server
node test-file-upload.js # Run tests

# Frontend
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
mongosh                  # MongoDB shell
mongosh --eval "db.stats()" # Check DB stats
mongosh --eval "db.files.find()" # View files

# Git
git status               # Check status
git add .                # Stage changes
git commit -m "message"  # Commit changes
git push                 # Push to remote
```

---

## Documentation Links

- **Complete Guide:** BACKEND_INTEGRATION.md
- **Setup Guide:** back/FILE_UPLOAD_SETUP.md
- **Overview:** FILE_UPLOAD_COMPLETE.md
- **Collaborator Guide:** COLLABORATOR_GUIDE.md
- **Implementation Summary:** IMPLEMENTATION_SUMMARY.md

---

## Support

**Issues?**
1. Check documentation
2. Review error messages
3. Test with curl
4. Check server logs
5. Verify environment variables

**Need Help?**
- Review inline code comments
- Check example implementations
- Test with provided scripts
- Contact team

---

**Last Updated:** April 28, 2026
**Status:** Production Ready
