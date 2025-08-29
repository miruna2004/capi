// src/components/CategoryModal.jsx - Updated with edit support
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
  VStack,
  useToast,
  HStack,
  Box,
  Text
} from '@chakra-ui/react';
import { useCreateCategory, useUpdateCategory } from '../hooks/useTodos';

const CategoryModal = ({ isOpen, onClose, category = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#3182CE',
  });

  const toast = useToast();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const isEditing = Boolean(category);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        color: category.color || '#3182CE',
      });
    } else {
      setFormData({
        name: '',
        color: '#3182CE',
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a category name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (isEditing) {
        await updateCategory.mutateAsync({ id: category.id, ...formData });
      } else {
        await createCategory.mutateAsync(formData);
      }
      
      onClose();
      // Reset form
      setFormData({
        name: '',
        color: '#3182CE',
      });
    } catch (error) {
      console.error('Category submission error:', error);
      // Error handling is done in the hooks
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isLoading = createCategory.isLoading || updateCategory.isLoading;

  // Color options
  const colorOptions = [
    '#3182CE', '#38A169', '#D69E2E', '#E53E3E', '#805AD5',
    '#DD6B20', '#319795', '#C53030', '#2D3748', '#1A202C'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="2xl" bg="white">
        <ModalHeader fontWeight="bold" color="gray.800">
          {isEditing ? 'Edit Category' : 'Create New Category'}
        </ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Category Name
                </FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter category name..."
                  borderRadius="lg"
                  _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Category Color
                </FormLabel>
                <VStack spacing={3}>
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    borderRadius="lg"
                    height="50px"
                    _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px #9F7AEA' }}
                  />
                  
                  <Text fontSize="sm" color="gray.500">Or choose from presets:</Text>
                  <HStack wrap="wrap" spacing={2} justify="center">
                    {colorOptions.map((color) => (
                      <Box
                        key={color}
                        width="30px"
                        height="30px"
                        bg={color}
                        borderRadius="md"
                        cursor="pointer"
                        border={formData.color === color ? "3px solid" : "1px solid"}
                        borderColor={formData.color === color ? "purple.400" : "gray.200"}
                        onClick={() => handleChange('color', color)}
                        _hover={{ transform: 'scale(1.1)' }}
                        transition="all 0.2s"
                      />
                    ))}
                  </HStack>
                </VStack>
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
                {isEditing ? 'Update Category' : 'Create Category'}
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CategoryModal;