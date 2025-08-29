// src/services/debugAPI.js - Debug version to see what's happening
const API_BASE_URL = 'http://localhost:8000/api';

class DebugAPIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🚀 API Request:', { url, options });
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('📤 Sending request to:', url);
      console.log('📋 Request config:', config);
      
      const response = await fetch(url, config);
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Success response:', data);
      return data;
    } catch (error) {
      console.error('💥 API Request failed:', error);
      throw error;
    }
  }

  // Categories
  async getCategories() {
    console.log('🏷️ Getting categories...');
    return this.request('/todos/categories/');
  }

  async createCategory(categoryData) {
    console.log('🏷️ Creating category:', categoryData);
    return this.request('/todos/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Todos
  async getTodos() {
    console.log('📝 Getting todos...');
    return this.request('/todos/todos/');
  }

  async createTodo(todoData) {
    console.log('📝 Creating todo:', todoData);
    return this.request('/todos/todos/', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
  }

  async updateTodo(id, todoData) {
    console.log('📝 Updating todo:', id, todoData);
    return this.request(`/todos/todos/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(todoData),
    });
  }

  async deleteTodo(id) {
    console.log('📝 Deleting todo:', id);
    return this.request(`/todos/todos/${id}/`, {
      method: 'DELETE',
    });
  }

  async toggleTodoComplete(id) {
    console.log('📝 Toggling todo complete:', id);
    return this.request(`/todos/todos/${id}/toggle_complete/`, {
      method: 'PATCH',
    });
  }

  async clearCompletedTodos() {
    console.log('📝 Clearing completed todos...');
    return this.request('/todos/todos/clear_completed/', {
      method: 'DELETE',
    });
  }
}

export default new DebugAPIService();