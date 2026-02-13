import request from '@/utils/request';
import type { Document, PaginatedResponse } from '@/types';

export const documentApi = {
  // Get document list
  getDocuments: (params?: { groupId?: string; page?: number; pageSize?: number }) => {
    return request.get<PaginatedResponse<Document>, PaginatedResponse<Document>>('/documents', { params });
  },

  // Get document by ID
  getDocument: (id: string) => {
    return request.get<Document, Document>(`/documents/${id}`);
  },

  // Create document
  createDocument: (data: Partial<Document>) => {
    return request.post<Document, Document>('/documents', data);
  },

  // Update document
  updateDocument: (id: string, data: Partial<Document>) => {
    return request.put<Document, Document>(`/documents/${id}`, data);
  },

  // Delete document
  deleteDocument: (id: string) => {
    return request.delete<void, void>(`/documents/${id}`);
  },

  // Search documents
  searchDocuments: (keyword: string) => {
    return request.get<Document[], Document[]>('/documents/search', { params: { keyword } });
  },
};
