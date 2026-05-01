import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, Order, Message, Lesson, OrderStatus, User, DeliveryStatus } from '@/data/types';
import { mockMessages } from '@/data/mockData';
import { generateAIResponse, getAITypingDelay } from '@/utils/aiAssistant';
import { productsApi, ordersApi, api } from '@/lib/api';

interface DataContextType {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
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
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Load products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await productsApi.getAll();
        if (response.data && response.data.products) {
          // Map backend products to frontend format
          const mappedProducts = response.data.products.map((p: any) => ({
            id: p._id,
            title: p.name,
            description: p.description,
            price: p.price,
            image: p.image || '/placeholder-product.jpg',
            category: p.category,
            sellerId: p.seller,
            sellerName: p.sellerName || 'Unknown Seller',
            stock: p.stock,
            sold: p.sold || 0,
            rating: p.rating || 0,
            reviews: p.reviews || 0,
          }));
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
      if (response.data) {
        setProducts(prev => [...prev, product]);
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
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
  const sendMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
    
    // Simulate delivery status progression
    setTimeout(() => {
      updateMessageDeliveryStatus(message.id, 'delivered', new Date().toISOString());
    }, 500);
    
    setTimeout(() => {
      updateMessageDeliveryStatus(message.id, 'received', new Date().toISOString());
    }, 1500);

    // If message is sent to AI assistant, generate AI response
    if (message.toId === 'ai-001') {
      const typingDelay = getAITypingDelay();
      setTimeout(() => {
        const aiResponse: Message = {
          id: String(Date.now() + Math.random()),
          fromId: 'ai-001',
          fromName: 'FarmDialogue Assistant',
          toId: message.fromId,
          toName: message.fromName,
          content: generateAIResponse(message.content),
          read: false,
          deliveryStatus: 'sent',
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, aiResponse]);
        
        // Auto-deliver AI response
        setTimeout(() => {
          updateMessageDeliveryStatus(aiResponse.id, 'delivered', new Date().toISOString());
        }, 300);
      }, typingDelay);
    }
  }, []);

  const markMessageAsRead = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { 
      ...m, 
      read: true,
      deliveryStatus: 'read',
      readAt: new Date().toISOString(),
    } : m));
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  }, []);

  const updateMessageDeliveryStatus = useCallback((messageId: string, status: DeliveryStatus, timestamp?: string) => {
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
          durationMin: lesson.durationMin,
          level: lesson.level,
        }),
      });
      if (response.ok) {
        setLessons(prev => [...prev, lesson]);
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

  return (
    <DataContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
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
