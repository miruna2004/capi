// src/pages/Todos.jsx - Animations Removed
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Icon,
  Grid,
  Card,
  CardBody,
  Text,
  Badge,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Spinner,
  HStack,
  VStack,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  MdAdd,
  MdSearch,
  MdMoreVert,
  MdEdit,
  MdDelete,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdFilterList,
  MdClear,
  MdPlaylistAdd,
} from 'react-icons/md';
import {
  useTodos,
  useToggleComplete,
  useDeleteTodo,
  useClearCompleted,
  useCategories,
} from '../hooks/useTodos';
import TodoModal from '../components/TodoModal';
import CategoryModal from '../components/CategoryModal';

const Todos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTodo, setSelectedTodo] = useState(null);
  
  const { isOpen: isTodoModalOpen, onOpen: onTodoModalOpen, onClose: onTodoModalClose } = useDisclosure();
  const { isOpen: isCategoryModalOpen, onOpen: onCategoryModalOpen, onClose: onCategoryModalClose } = useDisclosure();
  
  const { data: todos, isLoading } = useTodos();
  const { data: categories } = useCategories();
  const toggleComplete = useToggleComplete();
  const deleteTodo = useDeleteTodo();
  const clearCompleted = useClearCompleted();
  
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

  // Filter todos based on search and filters
  const filteredTodos = Array.isArray(todos) ? todos.filter(todo => {
    const matchesSearch = todo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && todo.completed) ||
                         (filterStatus === 'pending' && !todo.completed);
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || todo.category?.toString() === filterCategory;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  }) : [];

  const handleEditTodo = (todo) => {
    setSelectedTodo(todo);
    onTodoModalOpen();
  };

  const handleCreateTodo = () => {
    setSelectedTodo(null);
    onTodoModalOpen();
  };

  const handleToggleComplete = (todoId) => {
    toggleComplete.mutate(todoId);
  };

  const handleDeleteTodo = (todoId) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteTodo.mutate(todoId);
    }
  };

  const handleClearCompleted = () => {
    if (window.confirm('Are you sure you want to delete all completed todos?')) {
      clearCompleted.mutate();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const completedCount = Array.isArray(todos) ? todos.filter(todo => todo.completed).length : 0;

  if (isLoading) {
    return (
      <Box bgGradient={bgGradient} minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text color="gray.600" fontSize="lg">Loading your todos...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bgGradient={bgGradient} minH="100vh" p={8}>
      <VStack spacing={8} position="relative" zIndex={1}>
        {/* Header */}
        <Card {...glassStyle} width="100%" borderRadius="2xl">
          <CardBody p={8}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <VStack align="flex-start" spacing={2}>
                <Heading 
                  size="xl" 
                  bgGradient="linear(to-r, purple.400, blue.400, teal.400)" 
                  bgClip="text"
                  fontWeight="black"
                >
                  My Todos ✨
                </Heading>
                <Text color="gray.600">
                  Organize your tasks and boost your productivity
                </Text>
              </VStack>
              
              <HStack spacing={3}>
                <Button
                  leftIcon={<Icon as={MdAdd} />}
                  colorScheme="purple"
                  onClick={handleCreateTodo}
                  borderRadius="full"
                  size="lg"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.3s ease"
                >
                  New Todo
                </Button>
                <Button
                  leftIcon={<Icon as={MdAdd} />}
                  variant="outline"
                  onClick={onCategoryModalOpen}
                  borderRadius="full"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.3s ease"
                >
                  New Category
                </Button>
              </HStack>
            </Flex>
          </CardBody>
        </Card>

        {/* Filters and Search */}
        <Card {...glassStyle} width="100%" borderRadius="2xl">
          <CardBody p={6}>
            <VStack spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} width="100%">
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={MdSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search todos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    borderRadius="full"
                    bg="white"
                    _focus={{ boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)' }}
                  />
                </InputGroup>

                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  borderRadius="full"
                  bg="white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </Select>

                <Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  borderRadius="full"
                  bg="white"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </Select>

                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  borderRadius="full"
                  bg="white"
                >
                  <option value="all">All Categories</option>
                  {Array.isArray(categories) && categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Flex justify="space-between" align="center" width="100%">
                <Text fontSize="sm" color="gray.600">
                  Showing {filteredTodos.length} of {Array.isArray(todos) ? todos.length : 0} todos
                </Text>
                {completedCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    leftIcon={<Icon as={MdClear} />}
                    onClick={handleClearCompleted}
                    isLoading={clearCompleted.isLoading}
                    borderRadius="full"
                  >
                    Clear Completed ({completedCount})
                  </Button>
                )}
              </Flex>
            </VStack>
          </CardBody>
        </Card>

        {/* Todos Grid */}
        {filteredTodos.length === 0 ? (
          <Card {...glassStyle} borderRadius="2xl" width="100%">
            <CardBody textAlign="center" py={16}>
              <VStack spacing={6}>
                <Icon as={MdPlaylistAdd} boxSize={20} color="gray.300" />
                <VStack spacing={2}>
                  <Text fontSize="xl" color="gray.500" fontWeight="medium">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all'
                      ? 'No todos match your filters'
                      : 'No todos yet'}
                  </Text>
                  <Text color="gray.400">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Create your first todo to get started!'}
                  </Text>
                </VStack>
                <Button 
                  colorScheme="purple" 
                  onClick={handleCreateTodo}
                  size="lg"
                  borderRadius="full"
                  leftIcon={<Icon as={MdAdd} />}
                >
                  Create Todo
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} width="100%">
            {filteredTodos.map((todo, index) => (
              <Card 
                key={todo.id} 
                {...glassStyle} 
                borderRadius="2xl"
                transition="all 0.3s ease"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
              >
                <CardBody p={6}>
                  <Flex justify="space-between" align="flex-start" mb={4}>
                    <HStack spacing={3} flex={1} align="flex-start">
                      <Checkbox
                        isChecked={todo.completed}
                        onChange={() => handleToggleComplete(todo.id)}
                        colorScheme="green"
                        size="lg"
                        isDisabled={toggleComplete.isLoading}
                        mt={1}
                      />
                      <VStack align="flex-start" spacing={2} flex={1}>
                        <Text
                          fontWeight="semibold"
                          fontSize="lg"
                          textDecoration={todo.completed ? 'line-through' : 'none'}
                          color={todo.completed ? 'gray.500' : 'gray.800'}
                          noOfLines={2}
                        >
                          {todo.title}
                        </Text>
                        {todo.description && (
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            noOfLines={3}
                            textDecoration={todo.completed ? 'line-through' : 'none'}
                          >
                            {todo.description}
                          </Text>
                        )}
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
                          onClick={() => handleEditTodo(todo)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<MdDelete />}
                          onClick={() => handleDeleteTodo(todo.id)}
                          color="red.500"
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>

                  <VStack spacing={3} align="stretch">
                    <Flex justify="space-between" align="center">
                      <HStack spacing={2}>
                        <Badge 
                          colorScheme={getPriorityColor(todo.priority)}
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {todo.priority} priority
                        </Badge>
                        {todo.category_name && (
                          <Badge 
                            variant="outline"
                            style={{ 
                              borderColor: todo.category_color, 
                              color: todo.category_color 
                            }}
                            borderRadius="full"
                            px={3}
                            py={1}
                          >
                            {todo.category_name}
                          </Badge>
                        )}
                      </HStack>
                    </Flex>
                    
                    {todo.due_date && (
                      <Text fontSize="xs" color="gray.500" textAlign="right">
                        Due: {new Date(todo.due_date).toLocaleDateString()}
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      {/* Modals */}
      <TodoModal
        isOpen={isTodoModalOpen}
        onClose={onTodoModalClose}
        todo={selectedTodo}
        categories={categories}
      />
      
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={onCategoryModalClose}
      />
    </Box>
  );
};

export default Todos;