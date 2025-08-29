// src/components/EnhancedCategories.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  IconButton,
  Badge,
  useToast,
  Progress,
  Avatar,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';

// Smart auto-scrolling hook (same as todos)
const useSmartAutoScroll = (categories) => {
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsNearBottom(isVisible);
        setShowScrollButton(!isVisible && categories.length > 2);
      },
      { 
        root: container,
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [categories.length]);

  useEffect(() => {
    if (isNearBottom && containerRef.current && categories.length > 0) {
      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [categories, isNearBottom]);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  return {
    containerRef,
    sentinelRef,
    showScrollButton,
    scrollToBottom
  };
};

// Category Item Component
const CategoryItem = ({ category, onDelete }) => {
  const todoCount = category.todoCount || 0;
  const completedCount = category.completedCount || 0;
  const progressPercent = todoCount > 0 ? (completedCount / todoCount) * 100 : 0;

  return (
    <Box
      w="full"
      p={4}
      bg="white"
      borderRadius="xl"
      shadow="md"
      border="1px solid #e2e8f0"
    >
      <HStack spacing={4} align="start">
        <Avatar
          size="md"
          bg={category.color}
          icon={<Text fontSize="lg">📁</Text>}
        />
        <VStack align="start" flex="1" spacing={3}>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {category.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {category.colorCode}
            </Text>
          </VStack>
          
          <Badge colorScheme="blue" variant="subtle">
            {todoCount} TODOS
          </Badge>
          
          {todoCount > 0 && (
            <Box w="full">
              <Progress
                value={progressPercent}
                colorScheme={category.color.replace('#', '')}
                bg="gray.100"
                borderRadius="full"
                size="sm"
              />
            </Box>
          )}
          
          <Text fontSize="xs" color="gray.400">
            Created {category.createdDate}
          </Text>
        </VStack>
        
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="gray"
          icon="⋯"
          aria-label="Category options"
        />
      </HStack>
    </Box>
  );
};

// Main Enhanced Categories Component
const EnhancedCategories = () => {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: "wine", 
      color: "#3182CE", 
      colorCode: "#3182CE",
      todoCount: 0,
      completedCount: 0,
      createdDate: "6/24/2025"
    },
    { 
      id: 2, 
      name: "gin", 
      color: "#DD6B20", 
      colorCode: "#DD6B20",
      todoCount: 0,
      completedCount: 0,
      createdDate: "6/24/2025"
    },
    { 
      id: 3, 
      name: "fq34", 
      color: "#3182CE", 
      colorCode: "#3182CE",
      todoCount: 5,
      completedCount: 2,
      createdDate: "6/24/2025"
    },
    { 
      id: 4, 
      name: "Development", 
      color: "#805AD5", 
      colorCode: "#805AD5",
      todoCount: 8,
      completedCount: 3,
      createdDate: "6/23/2025"
    },
    { 
      id: 5, 
      name: "Work", 
      color: "#38A169", 
      colorCode: "#38A169",
      todoCount: 12,
      completedCount: 7,
      createdDate: "6/22/2025"
    },
    { 
      id: 6, 
      name: "Personal", 
      color: "#E53E3E", 
      colorCode: "#E53E3E",
      todoCount: 6,
      completedCount: 4,
      createdDate: "6/21/2025"
    }
  ]);
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchText, setSearchText] = useState('');
  const toast = useToast();

  const {
    containerRef,
    sentinelRef,
    showScrollButton,
    scrollToBottom
  } = useSmartAutoScroll(categories);

  // Add new category
  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Please enter a category name",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const colors = ["#3182CE", "#DD6B20", "#805AD5", "#38A169", "#E53E3E", "#D69E2E"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newCategory = {
      id: Date.now(),
      name: newCategoryName.trim(),
      color: randomColor,
      colorCode: randomColor,
      todoCount: 0,
      completedCount: 0,
      createdDate: new Date().toLocaleDateString()
    };

    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    
    toast({
      title: "Category added!",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
  };

  // Delete category
  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast({
      title: "Category deleted",
      status: "info",
      duration: 1500,
      isClosable: true,
    });
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalTodos = categories.reduce((sum, cat) => sum + cat.todoCount, 0);

  return (
    <Box h="100vh" display="flex" flexDirection="column" bg="gray.50">
      {/* Header */}
      <Box p={4} bg="white" borderBottom="1px solid #e2e8f0" zIndex={10}>
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            TASK1
          </Text>
          
          <VStack spacing={2}>
            <HStack>
              <Text fontSize="xl" fontWeight="bold" color="purple.600">
                Categories
              </Text>
              <Box w="6" h="6" bg="teal.400" borderRadius="md" />
            </HStack>
            <Text fontSize="md" color="gray.600" textAlign="center">
              Organize your todos with colorful categories
            </Text>
          </VStack>
          
          {/* New Category Button */}
          <Button
            leftIcon={<AddIcon />}
            colorScheme="purple"
            size="lg"
            w="full"
            onClick={() => document.getElementById('new-category-input')?.focus()}
          >
            New Category
          </Button>

          {/* Search */}
          <HStack w="full">
            <Input
              placeholder="Search categories..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              leftElement={<SearchIcon color="gray.400" />}
            />
          </HStack>

          {/* Stats */}
          <HStack w="full" justify="space-between">
            <Text fontSize="sm" color="gray.600">
              {filteredCategories.length} categories • {totalTodos} total todos
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* Scrollable Categories List */}
      <Box
        ref={containerRef}
        flex="1"
        overflowY="auto"
        overflowX="hidden"
        position="relative"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c4b5fd',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a78bfa',
          },
        }}
      >
        <VStack spacing={4} p={4} pb={20}>
          {filteredCategories.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.500">
                {searchText ? 'No categories match your search' : 'No categories yet. Add one below!'}
              </Text>
            </Box>
          ) : (
            filteredCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onDelete={deleteCategory}
              />
            ))
          )}
          {/* Invisible sentinel element for intersection observer */}
          <div ref={sentinelRef} style={{ height: '1px' }} />
        </VStack>
      </Box>

      {/* Floating Scroll Button */}
      {showScrollButton && (
        <IconButton
          icon={<ChevronDownIcon />}
          colorScheme="purple"
          size="lg"
          borderRadius="full"
          position="fixed"
          bottom="100px"
          right="20px"
          onClick={scrollToBottom}
          shadow="lg"
          zIndex={20}
          aria-label="Scroll to bottom"
        />
      )}

      {/* Fixed Bottom Input */}
      <Box p={4} bg="white" borderTop="1px solid #e2e8f0" zIndex={10}>
        <HStack spacing={3}>
          <Input
            id="new-category-input"
            placeholder="Add a new category..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            size="lg"
          />
          <IconButton
            icon={<AddIcon />}
            colorScheme="purple"
            size="lg"
            onClick={addCategory}
            aria-label="Add category"
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default EnhancedCategories;