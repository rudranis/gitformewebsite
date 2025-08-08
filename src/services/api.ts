import axios from 'axios';
import { LoginCredentials, RegisterData, MentalHealthForm, ApiResponse, User, RiskAssessment, Submission } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mindguard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mindguard_token');
      localStorage.removeItem('mindguard_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  }
};

export const assessmentApi = {
  submitForm: async (formData: MentalHealthForm): Promise<ApiResponse<RiskAssessment>> => {
    try {
      const response = await api.post('/assessment/submit', formData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Assessment failed'
      };
    }
  },

  getHistory: async (): Promise<ApiResponse<Submission[]>> => {
    try {
      const response = await api.get('/assessment/history');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch history'
      };
    }
  }
};

export default api;