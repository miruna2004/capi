// src/hooks/useTodos.js - Fixed hooks with proper error handling
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoAPI } from '../services/todoAPI';
import { useToast } from '@chakra-ui/react';

// Todos hooks
export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      try {
        const response = await todoAPI.getAllTodos();
        return response.data;
      } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
      }
    },
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
};

export const useTodoStats = () => {
  return useQuery({
    queryKey: ['todos', 'stats'],
    queryFn: async () => {
      try {
        const response = await todoAPI.getTodoStats();
        return response.data;
      } catch (error) {
        console.error('Error fetching todo stats:', error);
        throw error;
      }
    },
    staleTime: 10000, // 10 seconds
    retry: 2,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  return useMutation({
    mutationFn: async (todoData) => {
      try {
        const response = await todoAPI.createTodo(todoData);
        return response.data;
      } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos', 'stats'] });
      toast({
        title: 'Todo created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Create todo mutation error:', error);
      toast({
        title: 'Failed to create todo',
        description: error.response?.data?.detail || error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...todoData }) => {
      try {
        const response = await todoAPI.updateTodo(id, todoData);
        return response.data;
      } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos', 'stats'] });
      toast({
        title: 'Todo updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Update todo mutation error:', error);
      toast({
        title: 'Failed to update todo',
        description: error.response?.data?.detail || error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  return useMutation({
    mutationFn: async (todoId) => {
      try {
        await todoAPI.deleteTodo(todoId);
        return todoId;
      } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos', 'stats'] });
      toast({
        title: 'Todo deleted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Delete todo mutation error:', error);
      toast({
        title: 'Failed to delete todo',
        description: error.response?.data?.detail || error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useToggleComplete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (todoId) => {
      try {
        const response = await todoAPI.toggleComplete(todoId);
        return response.data;
      } catch (error) {
        console.error('Error toggling todo:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos', 'stats'] });
    },
    onError: (error) => {
      console.error('Toggle todo mutation error:', error);
    },
  });
};

export const useClearCompleted = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await todoAPI.clearCompleted();
        return response.data;
      } catch (error) {
        console.error('Error clearing completed todos:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos', 'stats'] });
      toast({
        title: data.message || 'Completed todos cleared successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Clear completed mutation error:', error);
      toast({
        title: 'Failed to clear completed todos',
        description: error.response?.data?.detail || error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await todoAPI.getAllCategories();
        return response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
    staleTime: 300000, // 5 minutes
    retry: 2,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  return useMutation({
    mutationFn: async (categoryData) => {
      try {
        const response = await todoAPI.createCategory(categoryData);
        return response.data;
      } catch (error) {
        console.error('Error creating category:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Category created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Create category mutation error:', error);
      toast({
        title: 'Failed to create category',
        description: error.response?.data?.detail || error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...categoryData }) => {
      try {
        const response = await todoAPI.updateCategory(id, categoryData);
        return response.data;
      } catch (error) {
        console.error('Error updating category:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Category updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Update category mutation error:', error);
      toast({
        title: 'Failed to update category',
        description: error.response?.data?.detail || error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  return useMutation({
    mutationFn: async (categoryId) => {
      try {
        await todoAPI.deleteCategory(categoryId);
        return categoryId;
      } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['todos'] }); // Also refresh todos in case they had this category
      toast({
        title: 'Category deleted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Delete category mutation error:', error);
      toast({
        title: 'Failed to delete category',
        description: error.response?.data?.detail || error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};