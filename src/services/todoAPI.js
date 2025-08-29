// src/services/todoAPI.js - Fixed todo API with proper endpoints
import api from './api';

export const todoAPI = {
  // Todo endpoints - Fixed to match your Django URLs
  getAllTodos: () => api.get('/todos/todos/'),
  getTodo: (id) => api.get(`/todos/todos/${id}/`),
  createTodo: (data) => api.post('/todos/todos/', data),
  updateTodo: (id, data) => api.put(`/todos/todos/${id}/`, data), // Use PUT for full update
  patchTodo: (id, data) => api.patch(`/todos/todos/${id}/`, data), // PATCH for partial update
  deleteTodo: (id) => api.delete(`/todos/todos/${id}/`),
  toggleComplete: (id) => api.patch(`/todos/todos/${id}/toggle_complete/`),
  
  // Filtered endpoints
  getCompletedTodos: () => api.get('/todos/todos/completed/'),
  getPendingTodos: () => api.get('/todos/todos/pending/'),
  getTodoStats: () => api.get('/todos/todos/stats/'),
  clearCompleted: () => api.delete('/todos/todos/clear_completed/'),
  
  // Category endpoints - Fixed to match your Django URLs
  getAllCategories: () => api.get('/todos/categories/'),
  getCategory: (id) => api.get(`/todos/categories/${id}/`),
  createCategory: (data) => api.post('/todos/categories/', data),
  updateCategory: (id, data) => api.put(`/todos/categories/${id}/`, data),
  patchCategory: (id, data) => api.patch(`/todos/categories/${id}/`, data),
  deleteCategory: (id) => api.delete(`/todos/categories/${id}/`),
};