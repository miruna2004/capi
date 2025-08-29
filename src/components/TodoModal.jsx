// src/components/TodoModal.jsx - Fixed with proper date formatting
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { useCreateTodo, useUpdateTodo } from '../hooks/useTodos';

const TodoModal = ({ isOpen, onClose, todo = null, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    due_date: '',
  });

  const toast = useToast();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  const isEditing = Boolean(todo);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        category: todo.category?.toString() || '',
        // Convert date to YYYY-MM-DD format for input
        due_date: todo.due_date ? new Date(todo.due_date).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        due_date: '',
      });
    }
  }, [todo, isOpen]);

  // Function to format date properly
  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If it's MM/DD/YYYY, convert to YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [month, day, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Try to parse and format
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.warn('Could not parse date:', dateString);
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title for your todo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Format the data properly for the API
    const todoData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category ? parseInt(formData.category) : null,
      due_date: formatDateForAPI(formData.due_date), // ✅ Format date properly
    };

    // 🔍 Debug log
    console.log('🔍 Sending todo data:', todoData);

    try {
      if (isEditing) {
        await updateTodo.mutateAsync({ id: todo.id, ...todoData });
      } else {
        await createTodo.mutateAsync(todoData);
      }
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        due_date: '',
      });
    } catch (error) {
      console.error('🔍 Form submission error:', error);
      // Error handling is done in the hooks
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isLoading = createTodo.isLoading || updateTodo.isLoading;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="2xl" bg="white">
        <ModalHeader fontWeight="bold" color="gray.800">
          {isEditing ? 'Edit Todo' : 'Create New Todo'}
        </ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Title
                </FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter todo title..."
                  borderRadius="lg"
                  _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Description
                </FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter todo description..."
                  borderRadius="lg"
                  resize="vertical"
                  _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                />
              </FormControl>

              <HStack spacing={4} width="100%">
                <FormControl>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Priority
                  </FormLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    borderRadius="lg"
                    _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Category
                  </FormLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    borderRadius="lg"
                    _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                  >
                    <option value="">No Category</option>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No categories available
                      </option>
                    )}
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Due Date
                </FormLabel>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleChange('due_date', e.target.value)}
                  borderRadius="lg"
                  _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                variant="ghost" 
                onClick={onClose}
                borderRadius="lg"
                _hover={{ bg: 'gray.100' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={isLoading}
                loadingText={isEditing ? 'Updating...' : 'Creating...'}
                borderRadius="lg"
                _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
                transition="all 0.2s ease"
              >
                {isEditing ? 'Update Todo' : 'Create Todo'}
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default TodoModal;