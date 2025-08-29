// src/components/EnhancedLayout.jsx - FIXED VERSION
import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiCheckSquare, 
  FiGrid, 
  FiStar, 
  FiUsers, 
  FiMenu,
  FiSettings,
  FiBell
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { hapticImpact } from '../utils/capacitor';

const EnhancedLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/todos', icon: FiCheckSquare, label: 'Todos' },
    { path: '/categories', icon: FiGrid, label: 'Categories' },
    { path: '/reviews', icon: FiStar, label: 'Reviews' },
    { path: '/users', icon: FiUsers, label: 'Users' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
    { path: '/notifications', icon: FiBell, label: 'Notifications' },
  ];

  const handleNavigation = async (path) => {
    // Add haptic feedback for navigation
    await hapticImpact();
    navigate(path);
    onClose(); // Close drawer on mobile
  };

  const NavButton = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Button
        leftIcon={<item.icon />}
        variant={isActive ? 'solid' : 'ghost'}
        colorScheme={isActive ? 'blue' : 'gray'}
        justifyContent="flex-start"
        onClick={() => handleNavigation(item.path)}
        size={isMobile ? 'md' : 'sm'}
        width="100%"
      >
        {item.label}
      </Button>
    );
  };

  return (
    <Flex 
      height="100vh" 
      overflow="hidden"
      direction={{ base: "column", md: "row" }}
    >
      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', md: 'block' }}
        width="250px"
        bg={bgColor}
        borderRight="1px"
        borderColor={borderColor}
        overflowY="auto"
        position="fixed"
        height="100vh"
        zIndex={10}
      >
        <VStack spacing={2} align="stretch" p={4}>
          <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
            TASK1 App
          </Text>
          {navItems.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}
        </VStack>
      </Box>

      {/* Mobile Header */}
      <Box 
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex={20}
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <HStack p={4} justify="space-between" align="center">
          <IconButton
            icon={<FiMenu />}
            variant="ghost"
            onClick={async () => {
              await hapticImpact();
              onOpen();
            }}
            aria-label="Open menu"
          />
          <Text fontSize="lg" fontWeight="bold">
            TASK1
          </Text>
          <Box w="40px" />
        </HStack>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navigation</DrawerHeader>
          <DrawerBody>
            <VStack spacing={2} align="stretch">
              {navItems.map((item) => (
                <NavButton key={item.path} item={item} isMobile />
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box
        flex={1}
        ml={{ base: 0, md: "250px" }} // Offset for desktop sidebar
        mt={{ base: "80px", md: 0 }} // Offset for mobile header
        overflow="auto"
        bg={useColorModeValue('gray.50', 'gray.800')}
        minHeight="100vh"
        position="relative"
      >
        <Box 
          p={{ base: 0, md: 4 }} 
          height="100%"
          maxWidth="100%"
          overflowX="hidden"
        >
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default EnhancedLayout;