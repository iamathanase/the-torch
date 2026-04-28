export type UserRole = 'admin' | 'farmer' | 'vendor' | 'gardener' | 'customer' | 'ai';
export type OnlineStatus = 'online' | 'away' | 'offline';
export type DeliveryStatus = 'sent' | 'delivered' | 'received' | 'read';
export type AICategoryContext = 'general' | 'farming' | 'orders' | 'products' | 'learning';

export interface FileUpload {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  purpose: 'profile' | 'product' | 'message' | 'document' | 'other';
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  coverImage?: string;
  verified: boolean;
  createdAt: string;
  lastSeen?: string;
  status?: OnlineStatus;
  bio?: string;
  isAI?: boolean;
  uploadedAt?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  sellerId: string;
  sellerName: string;
  stock: number;
  sold: number;
  createdAt: string;
  updatedAt?: string;
  uploadedAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  date: string;
  createdAt: string;
}

export interface Message {
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
  attachments?: FileUpload[];
  uploadedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  content: string;
  image: string;
  durationMin: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}
