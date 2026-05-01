import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, Order, Message, Lesson, OrderStatus, User, DeliveryStatus } from '@/data/types';
import { generateAIResponse, getAITypingDelay } from '@/utils/aiAssistant';
import { productsApi, ordersApi, api } from '@/lib/api';

interface DataContextType {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  refreshProducts: () => Promise<void>;
  loadingProducts: boolean;
  
  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  loadingOrders: boolean;
  
  // Messages
  messages: Message[];
  sendMessage: (message: Message) => void;
  markMessageAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  updateMessageDeliveryStatus: (messageId: string, status: DeliveryStatus, timestamp?: string) => void;
  
  // Lessons
  lessons: Lesson[];
  addLesson: (lesson: Lesson) => void;
  updateLesson: (id: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  refreshLessons: () => Promise<void>;
  loadingLessons: boolean;
  
  // Users (for admin)
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  refreshUsers: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await productsApi.getAll();
        console.log('Products response:', response); // Debug log
        if (response.data && response.data.products) {
          // Map backend products to frontend format
          const mappedProducts = response.data.products.map((p: any) => ({
            id: p._id,
            title: p.productName, // Backend uses productName
            description: p.description,
            price: p.price,
            image: p.image || '/placeholder-product.jpg',
            category: p.category,
            sellerId: p.userId?._id || p.userId, // Backend uses userId
            sellerName: p.userId?.firstName && p.userId?.lastName 
              ? `${p.userId.firstName} ${p.userId.lastName}` 
              : 'Unknown Seller',
            stock: p.quantityAvailable, // Backend uses quantityAvailable
            sold: 0, // Not tracked yet
            rating: 0,
            reviews: 0,
          }));
          console.log('Mapped products:', mappedProducts); // Debug log
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Load orders from backend on mount (only if authenticated)
  useEffect(() => {
    const fetchOrders = async () => {
      // Only fetch orders if user is authenticated
      const token = api.getToken();
      if (!token) {
        setLoadingOrders(false);
        return;
      }

      setLoadingOrders(true);
      try {
        const response = await ordersApi.getAll();
        if (response.data && response.data.orders) {
          // Map backend orders to frontend format
          const mappedOrders = response.data.orders.map((o: any) => ({
            id: o._id,
            productId: o.product,
            productTitle: o.productName || 'Product',
            productImage: o.productImage || '/placeholder-product.jpg',
            buyerId: o.buyer,
            buyerName: o.buyerName || 'Customer',
            sellerId: o.seller,
            sellerName: o.sellerName || 'Seller',
            quantity: o.quantity,
            total: o.totalPrice,
            status: o.status,
            date: new Date(o.createdAt).toLocaleDateString(),
          }));
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  // Load users from backend (admin only)
  useEffect(() => {
    const fetchUsers = async () => {
      const token = api.getToken();
      if (!token) {
        setLoadingUsers(false);
        return;
      }

      setLoadingUsers(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Users loaded:', data); // Debug log
          if (data.data && data.data.users) {
            // Map backend users to frontend format
            const mappedUsers = data.data.users.map((u: any) => ({
              id: u._id,
              name: `${u.firstName} ${u.lastName}`,
              email: u.email,
              role: u.role,
              avatar: u.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName}`,
              verified: u.isVerified,
              bio: u.bio || '',
              createdAt: u.createdAt,
            }));
            console.log('Mapped users:', mappedUsers); // Debug log
            setUsers(mappedUsers);
          }
        } else {
          console.error('Failed to fetch users:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    // Fetch users when component mounts and when token changes
    fetchUsers();
  }, []); // Keep empty dependency array but token check inside

  // Load lessons from backend
  useEffect(() => {
    const fetchLessons = async () => {
      setLoadingLessons(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/lessons`);
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.lessons) {
            // Map backend lessons to frontend format
            const mappedLessons = data.data.lessons.map((l: any) => ({
              id: l._id,
              title: l.title,
              category: l.category,
              content: l.content,
              image: l.image || '/placeholder-lesson.jpg',
              videoUrl: l.videoUrl,
              durationMin: l.durationMin,
              level: l.level,
              createdAt: l.createdAt,
            }));
            setLessons(mappedLessons);
          }
        }
      } catch (error) {
        console.error('Failed to load lessons:', error);
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchLessons();
  }, []);

  // Load messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      const token = api.getToken();
      if (!token) {
        setLoadingMessages(false);
        return;
      }

      setLoadingMessages(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Messages loaded:', data);
          if (data.data && data.data.messages) {
            setMessages(data.data.messages);
          }
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchMessages();
    
    // Auto-refresh messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Product operations
  const addProduct = useCallback(async (product: Product) => {
    try {
      const response = await productsApi.create({
        name: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: product.image,
      });
      
      if (response.data && response.data.product) {
        // Map backend product to frontend format
        const backendProduct = response.data.product;
        const mappedProduct: Product = {
          id: backendProduct._id,
          title: backendProduct.productName,
          description: backendProduct.description,
          price: backendProduct.price,
          category: backendProduct.category,
          image: backendProduct.image || '/placeholder-product.jpg',
          images: backendProduct.images || [],
          sellerId: backendProduct.userId?._id || backendProduct.userId,
          sellerName: backendProduct.userId?.firstName && backendProduct.userId?.lastName
            ? `${backendProduct.userId.firstName} ${backendProduct.userId.lastName}`
            : product.sellerName,
          stock: backendProduct.quantityAvailable,
          sold: 0,
          createdAt: new Date(backendProduct.createdAt).toISOString().split('T')[0],
        };
        
        // Add the backend product to state
        setProducts(prev => [...prev, mappedProduct]);
        return mappedProduct;
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const response = await productsApi.getAll();
      console.log('Products refreshed:', response);
      if (response.data && response.data.products) {
        const mappedProducts = response.data.products.map((p: any) => ({
          id: p._id,
          title: p.productName,
          description: p.description,
          price: p.price,
          image: p.image || '/placeholder-product.jpg',
          category: p.category,
          sellerId: p.userId?._id || p.userId,
          sellerName: p.userId?.firstName && p.userId?.lastName 
            ? `${p.userId.firstName} ${p.userId.lastName}` 
            : 'Unknown Seller',
          stock: p.quantityAvailable,
          sold: 0,
          rating: 0,
          reviews: 0,
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Failed to refresh products:', error);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const backendUpdates: any = {};
      if (updates.title) backendUpdates.name = updates.title;
      if (updates.description) backendUpdates.description = updates.description;
      if (updates.price) backendUpdates.price = updates.price;
      if (updates.category) backendUpdates.category = updates.category;
      if (updates.stock) backendUpdates.stock = updates.stock;
      if (updates.image) backendUpdates.image = updates.image;

      await productsApi.update(id, backendUpdates);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await productsApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }, []);

  // Order operations
  const addOrder = useCallback(async (order: Order) => {
    try {
      const response = await ordersApi.create({
        product: order.productId,
        quantity: order.quantity,
        totalPrice: order.total,
      });
      if (response.data) {
        setOrders(prev => [...prev, order]);
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      await ordersApi.update(orderId, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }, []);

  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      await ordersApi.update(orderId, { status: 'cancelled' });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o));
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }, []);

  // Message operations
  const sendMessage = useCallback(async (message: Message) => {
    try {
      console.log('Sending message:', { toId: message.toId, content: message.content });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.getToken()}`,
        },
        body: JSON.stringify({
          toId: message.toId,
          content: message.content,
          attachments: message.attachments || [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Message sent successfully:', data);
        if (data.data && data.data.message) {
          // Add the backend message to state
          setMessages(prev => [...prev, data.data.message]);
          return data.data.message;
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to send message:', errorData);
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, []);

  const markMessageAsRead = useCallback(async (messageId: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${api.getToken()}`,
        },
      });
      
      setMessages(prev => prev.map(m => m.id === messageId ? { 
        ...m, 
        read: true,
        deliveryStatus: 'read',
        readAt: new Date().toISOString(),
      } : m));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${api.getToken()}`,
        },
      });
      
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }, []);

  const updateMessageDeliveryStatus = useCallback(async (messageId: string, status: DeliveryStatus, timestamp?: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/messages/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.getToken()}`,
        },
        body: JSON.stringify({ status }),
      });

      const ts = timestamp || new Date().toISOString();
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) {
          const updated: Message = { ...m, deliveryStatus: status };
          
          if (status === 'delivered' && !m.deliveredAt) {
            updated.deliveredAt = ts;
          } else if (status === 'received' && !m.receivedAt) {
            updated.receivedAt = ts;
          } else if (status === 'read' && !m.readAt) {
            updated.readAt = ts;
            updated.read = true;
          }
          
          return updated;
        }
        return m;
      }));
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    }
  }, []);

  // User operations (admin)
  const addUser = useCallback((user: User) => {
    setUsers(prev => [...prev, user]);
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const refreshUsers = useCallback(async () => {
    const token = api.getToken();
    if (!token) return;

    setLoadingUsers(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Users refreshed:', data);
        if (data.data && data.data.users) {
          const mappedUsers = data.data.users.map((u: any) => ({
            id: u._id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            role: u.role,
            avatar: u.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName}`,
            verified: u.isVerified,
            bio: u.bio || '',
            createdAt: u.createdAt,
          }));
          setUsers(mappedUsers);
        }
      }
    } catch (error) {
      console.error('Failed to refresh users:', error);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Lesson operations (admin)
  const addLesson = useCallback(async (lesson: Lesson) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.getToken()}`,
        },
        body: JSON.stringify({
          title: lesson.title,
          category: lesson.category,
          content: lesson.content,
          image: lesson.image,
          videoUrl: lesson.videoUrl,
          durationMin: lesson.durationMin,
          level: lesson.level,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Lesson created:', data);
        
        if (data.data && data.data.lesson) {
          // Map backend lesson to frontend format
          const backendLesson = data.data.lesson;
          const mappedLesson: Lesson = {
            id: backendLesson._id,
            title: backendLesson.title,
            category: backendLesson.category,
            content: backendLesson.content,
            image: backendLesson.image || '/placeholder-lesson.jpg',
            videoUrl: backendLesson.videoUrl,
            durationMin: backendLesson.durationMin,
            level: backendLesson.level,
            createdAt: backendLesson.createdAt,
          };
          
          // Add the backend lesson to state
          setLessons(prev => [...prev, mappedLesson]);
          return mappedLesson;
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to create lesson:', errorData);
        throw new Error(errorData.message || 'Failed to create lesson');
      }
    } catch (error) {
      console.error('Failed to add lesson:', error);
      throw error;
    }
  }, []);

  const updateLesson = useCallback(async (id: string, updates: Partial<Lesson>) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/lessons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.getToken()}`,
        },
        body: JSON.stringify(updates),
      });
      setLessons(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    } catch (error) {
      console.error('Failed to update lesson:', error);
      throw error;
    }
  }, []);

  const deleteLesson = useCallback(async (id: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/lessons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${api.getToken()}`,
        },
      });
      setLessons(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      throw error;
    }
  }, []);

  const refreshLessons = useCallback(async () => {
    setLoadingLessons(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/lessons`);
      if (response.ok) {
        const data = await response.json();
        console.log('Lessons refreshed:', data);
        if (data.data && data.data.lessons) {
          const mappedLessons = data.data.lessons.map((l: any) => ({
            id: l._id,
            title: l.title,
            category: l.category,
            content: l.content,
            image: l.image || '/placeholder-lesson.jpg',
            videoUrl: l.videoUrl,
            durationMin: l.durationMin,
            level: l.level,
            createdAt: l.createdAt,
          }));
          setLessons(mappedLessons);
        }
      }
    } catch (error) {
      console.error('Failed to refresh lessons:', error);
    } finally {
      setLoadingLessons(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts,
      loadingProducts,
      orders,
      addOrder,
      updateOrderStatus,
      cancelOrder,
      loadingOrders,
      messages,
      sendMessage,
      markMessageAsRead,
      deleteMessage,
      updateMessageDeliveryStatus,
      lessons,
      addLesson,
      updateLesson,
      deleteLesson,
      refreshLessons,
      loadingLessons,
      users,
      addUser,
      updateUser,
      deleteUser,
      refreshUsers,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
