// User types
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Document types
export interface Document {
  id: string;
  title: string;
  content: string;
  groupId: string;
  userId: string;
  status?: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface DocumentGroup {
  id: string;
  name: string;
  pId: string; // parent id
  description?: string;
  sort?: number;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
