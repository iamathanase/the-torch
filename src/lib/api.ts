/**
 * API Client - Centralized HTTP requests to backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api';

interface ApiResponse<T> {
  status: number;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private static instance: ApiClient;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem('authToken');
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return {
        status: response.status,
        data: data.data,
        message: data.message,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 500,
        error: errorMessage,
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = ApiClient.getInstance();

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    phone?: string
  ) =>
    api.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
    }),

  logout: () => {
    api.clearToken();
  },
};

// Users API
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: Record<string, any>) => api.put('/users/profile', data),
  getAll: () => api.get('/users'),
};

// Products API
export const productsApi = {
  getAll: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/products${query ? '?' + query : ''}`);
  },
  getOne: (id: string) => api.get(`/products/${id}`),
  create: (data: Record<string, any>) => api.post('/products', data),
  update: (id: string, data: Record<string, any>) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Orders API
export const ordersApi = {
  getAll: () => api.get('/orders'),
  getOne: (id: string) => api.get(`/orders/${id}`),
  create: (data: Record<string, any>) => api.post('/orders', data),
  update: (id: string, data: Record<string, any>) => api.put(`/orders/${id}`, data),
};

// Messages API
export const messagesApi = {
  getAll: () => api.get('/messages'),
  getConversation: (userId: string) => api.get(`/messages/conversation/${userId}`),
  send: (data: Record<string, any>) => api.post('/messages', data),
};
