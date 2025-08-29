// src/components/Layout.jsx
import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  useToast,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  VStack,
  Icon,
  Link as ChakraLink
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  MdDashboard,
  MdStar,
  MdKeyboard,
  MdBugReport,
  MdNotifications,
  MdSettings,
  MdPeople,
  MdLogout,
} from 'react-icons/md';

const Layout = ({ children }) => {
  const { currentUser, backendUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Use backend user data if available, fallback to Firebase user
  const displayUser = backendUser || currentUser;
  const displayName = displayUser?.first_name && displayUser?.last_name 
    ? `${displayUser.first_name} ${displayUser.last_name}`
    : displayUser?.displayName || displayUser?.email;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    { name: 'Todos', icon: MdStar, path: '/todos' },
    { name: 'Categories', icon: MdKeyboard, path: '/categories' },
    { name: 'Reviews', icon: MdBugReport, path: '/reviews' },
    { name: 'Keywords', icon: MdKeyboard, path: '/keywords' },
    { name: 'Web crawler', icon: MdBugReport, path: '/crawler' },
    { name: 'Notifications', icon: MdNotifications, path: '/notifications', badge: '3' },
    { name: 'Settings', icon: MdSettings, path: '/settings' },
    { name: 'User management', icon: MdPeople, path: '/users' },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        w="250px"
        bg="white"
        borderRightWidth={1}
        borderColor="gray.200"
        p={4}
      >
        {/* Logo */}
        <Text fontSize="xl" fontWeight="bold" mb={8} color="gray.800">
          LOGO
        </Text>

        {/* Navigation Items */}
        <VStack spacing={2} align="stretch">
          {sidebarItems.map((item) => (
            <ChakraLink
              key={item.name}
              as={RouterLink}
              to={item.path}
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
            >
              <Flex
                align="center"
                p={3}
                rounded="md"
                bg={isActivePath(item.path) ? 'blue.500' : 'transparent'}
                color={isActivePath(item.path) ? 'white' : 'gray.700'}
                _hover={{
                  bg: isActivePath(item.path) ? 'blue.600' : 'gray.100',
                }}
                transition="all 0.2s"
              >
                <Icon as={item.icon} mr={3} />
                <Text flex={1} fontSize="sm">
                  {item.name}
                </Text>
                {item.badge && (
                  <Box
                    bg="orange.500"
                    color="white"
                    fontSize="xs"
                    px={2}
                    py={1}
                    rounded="full"
                  >
                    {item.badge}
                  </Box>
                )}
              </Flex>
            </ChakraLink>
          ))}

          {/* Logout Button */}
          <Button
            leftIcon={<Icon as={MdLogout} />}
            variant="ghost"
            justifyContent="flex-start"
            color="red.500"
            _hover={{ bg: 'red.50' }}
            onClick={handleLogout}
            mt={4}
          >
            Log out
          </Button>
        </VStack>
      </Box>

      {/* Main Content Area */}
      <Flex flex={1} direction="column">
        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px={6}
          py={4}
          bg="white"
          borderBottomWidth={1}
          borderColor="gray.200"
        >
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Dashboard
          </Text>
          
          <HStack spacing={4}>
            <Text fontSize="sm" color="gray.600">
              {displayName}
            </Text>
            
            <Menu>
              <MenuButton>
                <Avatar 
                  size="sm" 
                  name={displayName}
                  src={currentUser?.photoURL}
                  bg="purple.500"
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout} color="red.500">
                  <Icon as={MdLogout} mr={2} />
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {/* Page Content */}
        <Box as="main" flex={1} p={6} bg="gray.50">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;