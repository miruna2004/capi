// src/components/EnhancedTodos.jsx
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
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';

// Combined hook for smart auto-scrolling
const useSmartAutoScroll = (todos) => {
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Intersection Observer to detect if user is near bottom
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsNearBottom(isVisible);
        setShowScrollButton(!isVisible && todos.length > 3);
      },
      { 
        root: container,
        threshold: 0.1,
        rootMargin: '50px' // Trigger when within 50px of bottom
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [todos.length]);

  // Auto-scroll to bottom when todos change (only if near bottom)
  useEffect(() => {
    if (isNearBottom && containerRef.current && todos.length > 0) {
      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [todos, isNearBottom]);

  // Manual scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  return {
    containerRef,
    sentinelRef,
    isNearBottom,
    showScrollButton,
    scrollToBottom,
    scrollToTop
  };
};

// Todo Item Component
const TodoItem = ({ todo, onToggle, onDelete }) => (
  <Box
    w="full"
    p={4}
    bg="white"
    borderRadius="lg"
    shadow="sm"
    border="1px solid #e2e8f0"
  >
    <HStack spacing={3} align="start">
      <Checkbox
        isChecked={todo.completed}
        onChange={() => onToggle(todo.id)}
        colorScheme="purple"
        size="lg"
        mt={1}
      />
      <VStack align="start" flex="1" spacing={2}>
        <Text
          fontSize="md"
          fontWeight={todo.completed ? "normal" : "medium"}
          textDecoration={todo.completed ? "line-through" : "none"}
          color={todo.completed ? "gray.500" : "gray.800"}
        >
          {todo.text}
        </Text>
        {todo.category && (
          <Badge colorScheme="purple" variant="subtle" size="sm">
            {todo.category}
          </Badge>
        )}
        {todo.priority && (
          <Badge
            colorScheme={
              todo.priority === 'HIGH' ? 'red' : 
              todo.priority === 'MEDIUM' ? 'orange' : 'green'
            }
            variant="solid"
            size="sm"
          >
            {todo.priority} PRIORITY
          </Badge>
        )}
      </VStack>
      <IconButton
        size="sm"
        variant="ghost"
        colorScheme="red"
        icon="✕"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      />
    </HStack>
  </Box>
);

// Main Enhanced Todos Component
const EnhancedTodos = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Mobile", completed: true, category: "Development", priority: "MEDIUM" },
    { id: 2, text: "Desktop App", completed: false, category: "Development", priority: "HIGH" },
    { id: 3, text: "Review Code", completed: false, category: "Work", priority: "LOW" },
    { id: 4, text: "Update Documentation", completed: false, category: "Work", priority: "MEDIUM" },
    { id: 5, text: "Test Mobile App", completed: false, category: "Testing", priority: "HIGH" },
  ]);
  
  const [newTodoText, setNewTodoText] = useState('');
  const [searchText, setSearchText] = useState('');
  const toast = useToast();

  const {
    containerRef,
    sentinelRef,
    isNearBottom,
    showScrollButton,
    scrollToBottom,
    scrollToTop
  } = useSmartAutoScroll(todos);

  // Add new todo
  const addTodo = () => {
    if (!newTodoText.trim()) {
      toast({
        title: "Please enter a todo",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: newTodoText.trim(),
      completed: false,
      category: "General",
      priority: "MEDIUM"
    };

    setTodos(prev => [...prev, newTodo]);
    setNewTodoText('');
    
    toast({
      title: "Todo added!",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast({
      title: "Todo deleted",
      status: "info",
      duration: 1500,
      isClosable: true,
    });
  };

  // Filter todos based on search
  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <Box h="100vh" display="flex" flexDirection="column" bg="gray.50">
      {/* Header */}
      <Box p={4} bg="white" borderBottom="1px solid #e2e8f0" zIndex={10}>
        <VStack spacing={4}>
          
          <Text fontSize="md" color="gray.600" textAlign="center">
            Organize your tasks and boost your productivity
          </Text>
          
          {/* Action Buttons */}
          <HStack spacing={3} w="full">
            <Button
              leftIcon={<AddIcon />}
              colorScheme="purple"
              size="lg"
              flex="1"
              onClick={() => document.getElementById('new-todo-input')?.focus()}
            >
              New Todo
            </Button>
            <Button
              leftIcon={<AddIcon />}
              variant="outline"
              colorScheme="purple"
              size="lg"
              flex="1"
            >
              New Category
            </Button>
          </HStack>

          {/* Search */}
          <HStack w="full">
            <Input
              placeholder="Search todos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              leftElement={<SearchIcon color="gray.400" />}
            />
          </HStack>

          {/* Stats */}
          <HStack w="full" justify="space-between">
            <Text fontSize="sm" color="gray.600">
              Showing {filteredTodos.length} of {todos.length} todos
            </Text>
            {completedCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => setTodos(prev => prev.filter(todo => !todo.completed))}
              >
                Clear Completed ({completedCount})
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>

      {/* Scrollable Todos List */}
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
        <VStack spacing={3} p={4} pb={20}>
          {filteredTodos.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.500">
                {searchText ? 'No todos match your search' : 'No todos yet. Add one below!'}
              </Text>
            </Box>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
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
            id="new-todo-input"
            placeholder="Add a new todo..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            size="lg"
          />
          <IconButton
            icon={<AddIcon />}
            colorScheme="purple"
            size="lg"
            onClick={addTodo}
            aria-label="Add todo"
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default EnhancedTodos;