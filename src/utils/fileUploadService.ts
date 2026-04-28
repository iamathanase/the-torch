import { FileUpload } from '@/data/types';

/**
 * File Upload Service
 * Handles file uploads and prepares data for backend integration
 */

export interface UploadResponse {
  success: boolean;
  data?: FileUpload;
  error?: string;
}

export interface BackendUploadPayload {
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileData: string; // Base64 encoded file data
  purpose: 'profile' | 'product' | 'message' | 'document' | 'other';
  metadata?: Record<string, any>;
}

/**
 * Convert File to Base64 for frontend storage
 * Backend will receive this and handle actual file storage
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 data (remove data:image/jpeg;base64, prefix)
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Create FileUpload object from File
 * Ready for storage in state and sending to backend
 */
export async function createFileUpload(
  file: File,
  userId: string,
  purpose: 'profile' | 'product' | 'message' | 'document' | 'other',
  metadata?: Record<string, any>
): Promise<FileUpload> {
  const base64 = await fileToBase64(file);

  return {
    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    fileUrl: `data:${file.type};base64,${base64}`, // Frontend URL for preview
    thumbnailUrl: `data:${file.type};base64,${base64}`, // Can be resized by backend
    uploadedAt: new Date().toISOString(),
    purpose,
    metadata,
  };
}

/**
 * Prepare upload for backend API
 * Backend endpoint: POST /api/upload
 * Backend should handle: file storage, thumbnail generation, CDN upload
 */
export async function prepareBackendUpload(
  file: File,
  userId: string,
  purpose: 'profile' | 'product' | 'message' | 'document' | 'other',
  metadata?: Record<string, any>
): Promise<BackendUploadPayload> {
  const fileData = await fileToBase64(file);

  return {
    userId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    fileData, // Base64 encoded - backend stores this
    purpose,
    metadata,
  };
}

/**
 * Validate file before upload
 */
export interface ValidationConfig {
  maxSize: number; // MB
  allowedTypes: string[];
  allowedExtensions: string[];
}

export const DEFAULT_IMAGE_CONFIG: ValidationConfig = {
  maxSize: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
};

export const DEFAULT_DOCUMENT_CONFIG: ValidationConfig = {
  maxSize: 10,
  allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedExtensions: ['.pdf', '.doc', '.docx'],
};

export function validateFile(
  file: File,
  config: ValidationConfig = DEFAULT_IMAGE_CONFIG
): { valid: boolean; error?: string } {
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > config.maxSize) {
    return {
      valid: false,
      error: `File size ${fileSizeMB.toFixed(2)}MB exceeds limit of ${config.maxSize}MB`,
    };
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed. Allowed: ${config.allowedTypes.join(', ')}`,
    };
  }

  // Check extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = config.allowedExtensions.some(ext => fileName.endsWith(ext));
  if (!hasValidExtension) {
    return {
      valid: false,
      error: `File extension not allowed. Allowed: ${config.allowedExtensions.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Backend API Integration Examples
 * Your backend should implement these endpoints
 */

export const BACKEND_API_ENDPOINTS = {
  // User profile picture upload
  updateProfilePicture: 'POST /api/users/:userId/profile-picture',
  // User cover image upload
  updateCoverImage: 'POST /api/users/:userId/cover-image',
  // Product image upload
  addProductImage: 'POST /api/products/:productId/images',
  // Upload multiple product images
  addProductImages: 'POST /api/products/:productId/images/batch',
  // Message attachment upload
  addMessageAttachment: 'POST /api/messages/:messageId/attachments',
  // Generic file upload
  uploadFile: 'POST /api/files/upload',
  // Get file by ID
  getFile: 'GET /api/files/:fileId',
  // Delete file
  deleteFile: 'DELETE /api/files/:fileId',
};

/**
 * Expected Backend Upload Request Format
 * POST /api/files/upload
 *
 * Request Body:
 * {
 *   userId: string,
 *   fileName: string,
 *   fileSize: number,
 *   fileType: string,
 *   fileData: string (base64),
 *   purpose: 'profile' | 'product' | 'message' | 'document' | 'other',
 *   metadata: {
 *     productId?: string,
 *     messageId?: string,
 *     ...any additional context
 *   }
 * }
 *
 * Expected Response:
 * {
 *   success: true,
 *   data: {
 *     id: string,
 *     fileUrl: string (CDN URL or server URL),
 *     thumbnailUrl?: string,
 *     uploadedAt: string,
 *     ...rest of FileUpload interface
 *   }
 * }
 */

/**
 * Initialize file upload to backend
 * This is a template - implement in your backend
 */
export async function uploadFileToBackend(
  payload: BackendUploadPayload,
  backendUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:3000'
): Promise<UploadResponse> {
  try {
    const response = await fetch(`${backendUrl}/api/files/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add auth token
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Upload failed',
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload error',
    };
  }
}

/**
 * Delete file from backend
 */
export async function deleteFileFromBackend(
  fileId: string,
  backendUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:3000'
): Promise<UploadResponse> {
  try {
    const response = await fetch(`${backendUrl}/api/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Delete failed',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete error',
    };
  }
}
