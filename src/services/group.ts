import request from '@/utils/request';
import type { DocumentGroup } from '@/types';

export const groupApi = {
  // Get all groups
  getGroups: () => {
    return request.get<DocumentGroup[], DocumentGroup[]>('/groups');
  },

  // Get group by ID
  getGroup: (id: string) => {
    return request.get<DocumentGroup, DocumentGroup>(`/groups/${id}`);
  },

  // Create group
  createGroup: (data: Partial<DocumentGroup>) => {
    return request.post<DocumentGroup, DocumentGroup>('/groups', data);
  },

  // Update group
  updateGroup: (id: string, data: Partial<DocumentGroup>) => {
    return request.put<DocumentGroup, DocumentGroup>(`/groups/${id}`, data);
  },

  // Delete group
  deleteGroup: (id: string) => {
    return request.delete<void, void>(`/groups/${id}`);
  },

  // Get group tree
  getGroupTree: () => {
    return request.get<DocumentGroup[], DocumentGroup[]>('/groups/tree');
  },
};
