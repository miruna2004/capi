// src/pages/Categories.jsx - Fixed with glassmorphism design
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Grid,
  Card,
  CardBody,
  Text,
  Badge,
  Icon,
  useDisclosure,
  Spinner,
  useColorModeValue,
  VStack,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  useToast,
  
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { MdAdd, MdCategory, MdMoreVert, MdEdit, MdDelete, MdColorLens } from 'react-icons/md';
import { useCategories, useDeleteCategory } from '../hooks/useTodos';
import CategoryModal from '../components/CategoryModal';

// Animations
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const Categories = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: categories, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const bgGradient = useColorModeValue(
    'linear(to-br, purple.50, blue.50, pink.50)',
    'linear(to-br, gray.900, purple.900, blue.900)'
  );
  
  const glassStyle = {
    bg: useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)'),
    backdropFilter: 'blur(20px)',
    borderWidth: '1px',
    borderColor: useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'),
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    onOpen();
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    onOpen();
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      deleteCategory.mutate(categoryId);
    }
  };

  if (isLoading) {
    return (
      <Box bgGradient={bgGradient} minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text color="gray.600" fontSize="lg">Loading categories...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bgGradient={bgGradient} minH="100vh" p={8}>
        <Card {...glassStyle} borderRadius="2xl" maxW="md" mx="auto" mt={20}>
          <CardBody textAlign="center" p={8}>
            <Icon as={MdCategory} boxSize={16} color="red.400" mb={4} />
            <Text fontSize="xl" fontWeight="bold" color="red.500" mb={2}>
              Failed to Load Categories
            </Text>
            <Text color="gray.600" mb={4}>
              {error.message || 'Something went wrong while fetching categories.'}
            </Text>
            <Button colorScheme="purple" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <Box bgGradient={bgGradient} minH="100vh" p={8}>
      {/* Floating particles effect */}
      <Box position="fixed" top="0" left="0" right="0" bottom="0" pointerEvents="none" zIndex={0}>
        {[...Array(15)].map((_, i) => (
          <Box
            key={i}
            position="absolute"
            width="4px"
            height="4px"
            bg="purple.300"
            borderRadius="full"
            opacity={0.3}
            left={`${Math.random() * 100}%`}
            top={`${Math.random() * 100}%`}
            css={{
              animation: `${floatAnimation} ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </Box>

      <VStack spacing={8} position="relative" zIndex={1}>
        {/* Header */}
        <Card {...glassStyle} width="100%" borderRadius="2xl" css={{ animation: `${slideIn} 0.6s ease-out` }}>
          <CardBody p={8}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <VStack align="flex-start" spacing={2}>
                <Heading 
                  size="xl" 
                  bgGradient="linear(to-r, purple.400, blue.400, teal.400)" 
                  bgClip="text"
                  fontWeight="black"
                >
                  Categories 🏷️
                </Heading>
                <Text color="gray.600">
                  Organize your todos with colorful categories
                </Text>
              </VStack>
              
              <Button
                leftIcon={<Icon as={MdAdd} />}
                colorScheme="purple"
                onClick={handleCreateCategory}
                borderRadius="full"
                size="lg"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.3s ease"
              >
                New Category
              </Button>
            </Flex>
          </CardBody>
        </Card>

        {/* Categories Content */}
        {!categories || categories.length === 0 ? (
          <Card {...glassStyle} borderRadius="2xl" width="100%">
            <CardBody textAlign="center" py={16}>
              <VStack spacing={6}>
                <Box
                  p={6}
                  borderRadius="full"
                  bg="purple.100"
                  color="purple.500"
                  css={{ animation: `${floatAnimation} 3s ease-in-out infinite` }}
                >
                  <Icon as={MdCategory} boxSize={16} />
                </Box>
                <VStack spacing={2}>
                  <Text fontSize="xl" color="gray.500" fontWeight="medium">
                    No categories yet
                  </Text>
                  <Text color="gray.400">
                    Create your first category to organize your todos!
                  </Text>
                </VStack>
                <Button 
                  colorScheme="purple" 
                  onClick={handleCreateCategory}
                  size="lg"
                  borderRadius="full"
                  leftIcon={<Icon as={MdAdd} />}
                >
                  Create First Category
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6} width="100%">
            {categories.map((category, index) => (
              <Card 
                key={category.id} 
                {...glassStyle} 
                borderRadius="2xl"
                transition="all 0.3s ease"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
                css={{
                  animation: `${slideIn} ${0.3 + index * 0.1}s ease-out`,
                }}
              >
                <CardBody p={6}>
                  <Flex justify="space-between" align="flex-start" mb={4}>
                    <HStack spacing={3} flex={1}>
                      <Box
                        width="40px"
                        height="40px"
                        backgroundColor={category.color || '#3182CE'}
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="0 4px 12px rgba(0,0,0,0.15)"
                        css={{ animation: `${floatAnimation} 2s ease-in-out infinite` }}
                      >
                        <Icon as={MdColorLens} color="white" boxSize={5} />
                      </Box>
                      <VStack align="flex-start" spacing={1} flex={1}>
                        <Text fontWeight="bold" fontSize="lg" color="gray.800" noOfLines={1}>
                          {category.name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {category.color || '#3182CE'}
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<MdMoreVert />}
                        variant="ghost"
                        size="sm"
                        borderRadius="full"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<MdEdit />}
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<MdDelete />}
                          onClick={() => handleDeleteCategory(category.id)}
                          color="red.500"
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                  
                  <VStack spacing={3} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Badge 
                        colorScheme="blue" 
                        variant="subtle"
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        {category.todo_count || 0} todos
                      </Badge>
                      
                      <Text fontSize="xs" color="gray.500">
                        Created {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'Recently'}
                      </Text>
                    </Flex>
                    
                    {/* Color preview bar */}
                    <Box
                      height="4px"
                      width="100%"
                      backgroundColor={category.color || '#3182CE'}
                      borderRadius="full"
                      opacity={0.6}
                    />
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Quick Stats */}
        {categories && categories.length > 0 && (
          <Card {...glassStyle} borderRadius="2xl" width="100%">
            <CardBody p={6}>
              <VStack spacing={4}>
                <Heading size="md" color="gray.700">Category Statistics</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} width="100%">
                  <VStack>
                    <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                      {categories.length}
                    </Text>
                    <Text fontSize="sm" color="gray.600">Total Categories</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                      {categories.reduce((sum, cat) => sum + (cat.todo_count || 0), 0)}
                    </Text>
                    <Text fontSize="sm" color="gray.600">Total Todos</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="3xl" fontWeight="bold" color="green.500">
                      {categories.length > 0 ? Math.round(categories.reduce((sum, cat) => sum + (cat.todo_count || 0), 0) / categories.length) : 0}
                    </Text>
                    <Text fontSize="sm" color="gray.600">Avg per Category</Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* Modal */}
      <CategoryModal 
        isOpen={isOpen} 
        onClose={() => {
          onClose();
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />
    </Box>
  );
};

export default Categories;