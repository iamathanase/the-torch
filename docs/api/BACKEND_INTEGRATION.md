# The Torch Backend Integration Guide

## Overview

This document provides complete backend integration requirements for The Torch. The frontend is fully prepared to connect to your backend APIs. All file uploads are sent as base64-encoded data for secure handling.

---

## File Upload System

### Frontend-to-Backend Flow

1. **User selects file** via FileUpload component
2. **Frontend converts to base64** using `fileToBase64()` utility
3. **Frontend sends JSON payload** with base64 data to backend API
4. **Backend stores file** (local, CDN, cloud storage)
5. **Backend returns URL** for frontend to display

### File Upload Purpose Types

- `profile` - User profile pictures and cover images
- `product` - Product listing images (multiple per product)
- `message` - Message attachments (images, documents)
- `document` - General documents (PDFs, Word docs)
- `other` - Any other file type

---

## API Endpoints

### 1. File Upload Endpoint

**Endpoint:** `POST /api/files/upload`

**Authentication:** Required (Bearer Token in Authorization header)

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "userId": "string",
  "fileName": "tomatoes.jpg",
  "fileSize": 245632,
  "fileType": "image/jpeg",
  "fileData": "string (base64 encoded file data)",
  "purpose": "product",
  "metadata": {
    "productId": "optional-product-id",
    "messageId": "optional-message-id",
    "description": "optional context"
  }
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "file-1714326458000-abc123def",
    "userId": "user-001",
    "fileName": "tomatoes.jpg",
    "fileSize": 245632,
    "fileType": "image/jpeg",
    "fileUrl": "https://cdn.farmdialogue.com/files/file-1714326458000-abc123def.jpg",
    "thumbnailUrl": "https://cdn.farmdialogue.com/files/thumbnails/file-1714326458000-abc123def-thumb.jpg",
    "uploadedAt": "2024-04-28T14:27:38.000Z",
    "purpose": "product",
    "metadata": {
      "productId": "optional-product-id"
    }
  }
}
```

**Response (Error - 400/413/415):**
```json
{
  "success": false,
  "error": "File size exceeds limit"
}
```

**Backend Requirements:**
- ✅ Validate file size (max 10MB for messages, 5MB for profiles/products)
- ✅ Validate file type based on purpose
- ✅ Decode base64 file data
- ✅ Store file securely (local storage, S3, Azure Blob, etc.)
- ✅ Generate file ID
- ✅ Generate thumbnail for images (optional but recommended)
- ✅ Return URL for file access
- ✅ Log upload metadata

---

### 2. Get File Endpoint

**Endpoint:** `GET /api/files/:fileId`

**Response (Success - 200):**
- Return file directly with appropriate Content-Type header
- Or redirect to CDN URL

**Response (Error - 404):**
```json
{
  "error": "File not found"
}
```

---

### 3. Delete File Endpoint

**Endpoint:** `DELETE /api/files/:fileId`

**Authentication:** Required (Bearer Token)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

**Response (Error - 403):**
```json
{
  "success": false,
  "error": "Unauthorized - only file owner can delete"
}
```

**Backend Requirements:**
- ✅ Verify user owns the file
- ✅ Delete file from storage
- ✅ Delete thumbnails
- ✅ Remove database record

---

### 4. Update User Profile Picture

**Endpoint:** `POST /api/users/:userId/profile-picture`

**Request:** (same as file upload with purpose: 'profile')

**Backend Requirements:**
- ✅ Update User.avatar field with fileUrl
- ✅ Update User.uploadedAt timestamp
- ✅ Delete previous profile picture
- ✅ Return updated User object

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-001",
    "avatar": "https://cdn.farmdialogue.com/files/...",
    "uploadedAt": "2024-04-28T14:27:38.000Z"
  }
}
```

---

### 5. Update User Cover Image

**Endpoint:** `POST /api/users/:userId/cover-image`

**Request:** (same as file upload with purpose: 'profile')

**Backend Requirements:**
- ✅ Update User.coverImage field
- ✅ Delete previous cover image
- ✅ Return updated User object

---

### 6. Add Product Image

**Endpoint:** `POST /api/products/:productId/images`

**Request:** (file upload with purpose: 'product')

**Backend Requirements:**
- ✅ Add fileUrl to Product.images array
- ✅ Update Product.image if first image
- ✅ Update Product.uploadedAt timestamp
- ✅ Return updated Product object

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product-001",
    "image": "https://cdn.farmdialogue.com/files/...",
    "images": [
      "https://cdn.farmdialogue.com/files/...",
      "https://cdn.farmdialogue.com/files/..."
    ],
    "uploadedAt": "2024-04-28T14:27:38.000Z"
  }
}
```

---

### 7. Add Multiple Product Images (Batch)

**Endpoint:** `POST /api/products/:productId/images/batch`

**Request Body:**
```json
{
  "files": [
    {
      "userId": "user-001",
      "fileName": "product1.jpg",
      "fileSize": 245632,
      "fileType": "image/jpeg",
      "fileData": "base64...",
      "purpose": "product"
    },
    {
      "userId": "user-001",
      "fileName": "product2.jpg",
      "fileSize": 324567,
      "fileType": "image/jpeg",
      "fileData": "base64...",
      "purpose": "product"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productId": "product-001",
    "images": ["url1", "url2"],
    "uploadedAt": "2024-04-28T14:27:38.000Z"
  }
}
```

---

### 8. Add Message Attachment

**Endpoint:** `POST /api/messages/:messageId/attachments`

**Request:** (file upload with purpose: 'message')

**Backend Requirements:**
- ✅ Add FileUpload to Message.attachments array
- ✅ Update Message.uploadedAt timestamp
- ✅ Store attachment metadata

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "msg-001",
    "attachments": [
      {
        "id": "file-123",
        "fileName": "image.jpg",
        "fileUrl": "https://cdn.farmdialogue.com/files/...",
        "fileType": "image/jpeg"
      }
    ]
  }
}
```

---

## Data Models

### FileUpload Interface

```typescript
interface FileUpload {
  id: string;                    // Unique file ID
  userId: string;                // User who uploaded
  fileName: string;              // Original file name
  fileSize: number;              // Size in bytes
  fileType: string;              // MIME type (image/jpeg, etc.)
  fileUrl: string;               // URL for accessing file
  thumbnailUrl?: string;         // Thumbnail URL (for images)
  uploadedAt: string;            // ISO timestamp
  purpose: string;               // profile | product | message | document | other
  metadata?: Record<string, any>; // Additional context
}
```

### Updated User Model

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;               // NEW: Profile picture URL
  coverImage?: string;           // NEW: Cover image URL
  verified: boolean;
  createdAt: string;
  lastSeen?: string;
  status?: OnlineStatus;
  bio?: string;
  isAI?: boolean;
  uploadedAt?: string;           // NEW: Last upload timestamp
}
```

### Updated Product Model

```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;                 // Primary image
  images?: string[];             // NEW: Multiple images
  sellerId: string;
  sellerName: string;
  stock: number;
  sold: number;
  createdAt: string;
  updatedAt?: string;            // NEW: Last update
  uploadedAt?: string;           // NEW: Last image upload
}
```

### Updated Message Model

```typescript
interface Message {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  content: string;
  read: boolean;
  deliveryStatus: DeliveryStatus;
  sentAt: string;
  deliveredAt?: string;
  receivedAt?: string;
  readAt?: string;
  createdAt: string;
  attachments?: FileUpload[];     // NEW: Message attachments
  uploadedAt?: string;           // NEW: Last attachment upload
}
```

---

## File Storage Recommendations

### Option 1: Local Storage (Development)
```
/uploads/
├── profiles/
│   ├── user-001-avatar.jpg
│   └── user-001-cover.jpg
├── products/
│   ├── product-001-1.jpg
│   ├── product-001-2.jpg
│   └── thumbnails/
│       └── product-001-1-thumb.jpg
├── messages/
│   └── msg-001-1.jpg
└── temp/
```

### Option 2: AWS S3
```
s3://farmdialogue-uploads/
├── profiles/{userId}/{fileId}
├── products/{productId}/{fileId}
├── messages/{messageId}/{fileId}
└── thumbnails/{fileId}
```

### Option 3: Azure Blob Storage
```
farmdialogue-uploads/
├── profiles/
├── products/
├── messages/
└── thumbnails/
```

### Option 4: Cloudinary / Firebase
Use their SDKs for automatic uploads and transformations.

---

## Image Processing

### Recommended: Generate Thumbnails

For every image upload, generate a thumbnail:
- Max width: 200px
- Max height: 200px
- Quality: 80%
- Format: Same as original

```javascript
// Example: Using Sharp (Node.js)
const sharp = require('sharp');

const buffer = Buffer.from(base64Data, 'base64');
const thumbnail = await sharp(buffer)
  .resize(200, 200, { fit: 'cover' })
  .toBuffer();

// Save both original and thumbnail
await saveFile(fileId, buffer);
await saveFile(`${fileId}-thumb`, thumbnail);
```

---

## Frontend Integration Code

### Example: Implementing Upload in Backend

```php
// PHP Example - Route Handler
POST /api/files/upload

$data = json_decode(file_get_contents('php://input'), true);

// Validate
if ($data['fileSize'] > 10 * 1024 * 1024) {
    return error('File too large', 413);
}

// Decode base64
$binaryData = base64_decode($data['fileData']);

// Generate filename
$fileId = 'file-' . time() . '-' . uniqid();
$ext = getExtension($data['fileType']);
$filename = $fileId . '.' . $ext;

// Save file
$filepath = "/uploads/" . $data['purpose'] . "/" . $filename;
file_put_contents($filepath, $binaryData);

// Generate thumbnail for images
if (strpos($data['fileType'], 'image/') === 0) {
    generateThumbnail($filepath);
}

// Store in database
$fileUrl = "/uploads/" . $data['purpose'] . "/" . $filename;
$file = File::create([
    'id' => $fileId,
    'userId' => $data['userId'],
    'fileName' => $data['fileName'],
    'fileSize' => $data['fileSize'],
    'fileType' => $data['fileType'],
    'fileUrl' => $fileUrl,
    'purpose' => $data['purpose'],
    'metadata' => $data['metadata'],
    'uploadedAt' => now(),
]);

return success($file);
```

---

## Database Schema

### files table

```sql
CREATE TABLE files (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    purpose VARCHAR(50) NOT NULL, -- profile, product, message, document, other
    metadata JSON,
    uploaded_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (user_id),
    INDEX (purpose),
    INDEX (uploaded_at)
);
```

### Updates to users table

```sql
ALTER TABLE users ADD COLUMN avatar VARCHAR(500);
ALTER TABLE users ADD COLUMN cover_image VARCHAR(500);
ALTER TABLE users ADD COLUMN uploaded_at DATETIME;
```

### Updates to products table

```sql
ALTER TABLE products ADD COLUMN images JSON;
ALTER TABLE products ADD COLUMN updated_at DATETIME;
ALTER TABLE products ADD COLUMN uploaded_at DATETIME;
```

### Updates to messages table

```sql
ALTER TABLE messages ADD COLUMN attachments JSON;
ALTER TABLE messages ADD COLUMN uploaded_at DATETIME;
```

---

## Error Handling

### Common Error Responses

**400 Bad Request - Missing Fields**
```json
{
  "success": false,
  "error": "Missing required field: userId"
}
```

**413 Payload Too Large**
```json
{
  "success": false,
  "error": "File size exceeds 10MB limit"
}
```

**415 Unsupported Media Type**
```json
{
  "success": false,
  "error": "File type not allowed. Allowed types: image/jpeg, image/png"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Invalid or missing authentication token"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "You do not have permission to delete this file"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Failed to process file upload"
}
```

---

## Testing

### Test Files

1. **Small Image** (valid)
   - File: test-image.jpg
   - Size: 500KB
   - Type: image/jpeg

2. **Large File** (should fail)
   - File: large-file.zip
   - Size: 50MB
   - Expected error: File too large

3. **Invalid Type** (should fail)
   - File: script.exe
   - Size: 1MB
   - Expected error: File type not allowed

### cURL Examples

```bash
# Test file upload
curl -X POST http://localhost:3000/api/files/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "userId": "user-001",
    "fileName": "test.jpg",
    "fileSize": 245632,
    "fileType": "image/jpeg",
    "fileData": "base64_data_here",
    "purpose": "product"
  }'

# Test get file
curl http://localhost:3000/api/files/file-123

# Test delete file
curl -X DELETE http://localhost:3000/api/files/file-123 \
  -H "Authorization: Bearer TOKEN"
```

---

## Performance Optimization

### Recommendations

1. **Async Processing**
   - Process file uploads asynchronously
   - Generate thumbnails in background job
   - Use message queues (Redis, RabbitMQ)

2. **Caching**
   - Cache file metadata in Redis
   - Set CDN cache headers (1 year for images)
   - Cache thumbnail generation results

3. **Rate Limiting**
   - Limit uploads per user (e.g., 100 files/day)
   - Limit file size per upload (10MB max)
   - Implement backoff strategy

4. **Storage Optimization**
   - Compress images on upload
   - Delete old attachments after retention period
   - Archive unused files monthly

---

## Security Best Practices

1. ✅ **Validate file type** - Check MIME type and extension
2. ✅ **Scan for malware** - Use antivirus scanner
3. ✅ **Sanitize filename** - Prevent path traversal attacks
4. ✅ **Rate limiting** - Prevent abuse
5. ✅ **Access control** - Only owners can delete files
6. ✅ **HTTPS only** - All uploads over secure connection
7. ✅ **Store securely** - Outside web root if possible
8. ✅ **Expire tokens** - Implement token expiration

---

## Migration Path

### Phase 1: Basic Upload
- [ ] Implement POST /api/files/upload
- [ ] Store files locally
- [ ] Return file URLs

### Phase 2: Image Processing
- [ ] Generate thumbnails
- [ ] Compress images
- [ ] Set cache headers

### Phase 3: CDN Integration
- [ ] Integrate S3/Azure/Cloudinary
- [ ] Setup CDN
- [ ] Implement caching

### Phase 4: Advanced Features
- [ ] Batch uploads
- [ ] Resume interrupted uploads
- [ ] Virus scanning
- [ ] Analytics

---

## Frontend Environment Variables

Add to your backend URL in `.env`:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=30000
```

---

## Support

For questions about integration:
- Review the TypeScript interfaces in `src/data/types.ts`
- Check utility functions in `src/utils/fileUploadService.ts`
- Review example implementations in `src/components/modals/AddProductModal.tsx`

Frontend is ready for full backend implementation!
