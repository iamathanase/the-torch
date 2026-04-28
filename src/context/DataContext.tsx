import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, Order, Message, Lesson, OrderStatus, User, DeliveryStatus } from '@/data/types';
import { mockProducts, mockOrders, mockMessages, mockLessons, mockUsers } from '@/data/mockData';
import { generateAIResponse, getAITypingDelay } from '@/utils/aiAssistant';

interface DataContextType {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  
  // Messages
  messages: Message[];
  sendMessage: (message: Message) => void;
  markMessageAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  updateMessageDeliveryStatus: (messageId: string, status: DeliveryStatus, timestamp?: string) => void;
  
  // Lessons
  lessons: Lesson[];
  
  // Users (for admin)
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [lessons] = useState<Lesson[]>(mockLessons);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Product operations
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // Order operations
  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [...prev, order]);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o));
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

  return (
    <DataContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      addOrder,
      updateOrderStatus,
      cancelOrder,
      messages,
      sendMessage,
      markMessageAsRead,
      deleteMessage,
      updateMessageDeliveryStatus,
      lessons,
      users,
      addUser,
      updateUser,
      deleteUser,
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
