import request from '@/utils/request';
import type { LoginRequest, LoginResponse, User } from '@/types';

export const authApi = {
  // Login
  login: (data: LoginRequest) => {
    return request.post<LoginResponse, LoginResponse>('/auth/login', data);
  },

  // Register
  register: (data: LoginRequest) => {
    return request.post<LoginResponse, LoginResponse>('/auth/register', data);
  },

  // Get current user info
  getCurrentUser: () => {
    return request.get<User, User>('/auth/current');
  },

  // Logout
  logout: () => {
    return request.post<void, void>('/auth/logout');
  },
};
