// src/components/EnhancedLayout.jsx - SIMPLIFIED VERSION
import React from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiCheckSquare, 
  FiGrid, 
  FiStar, 
  FiUsers, 
  FiMenu,
  FiSettings,
  FiBell,
  FiSmartphone
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { hapticImpact } from '../utils/capacitor';

const EnhancedLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  console.log('EnhancedLayout: Rendering layout');

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/todos', icon: FiCheckSquare, label: 'Todos' },
    { path: '/categories', icon: FiGrid, label: 'Categories' },
    { path: '/reviews', icon: FiStar, label: 'Reviews' },
    { path: '/shake-demo', icon: FiSmartphone, label: 'Shake Demo' },
    { path: '/users', icon: FiUsers, label: 'Users' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
    { path: '/notifications', icon: FiBell, label: 'Notifications' },
  ];

  const handleNavigation = async (path) => {
    console.log('EnhancedLayout: Navigating to', path);
    try {
      await hapticImpact();
    } catch (error) {
      console.log('EnhancedLayout: Haptic feedback failed:', error);
    }
    navigate(path);
    onClose();
  };

  const NavButton = ({ item }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Button
        leftIcon={<item.icon />}
        variant={isActive ? 'solid' : 'ghost'}
        colorScheme={isActive ? 'blue' : 'gray'}
        justifyContent="flex-start"
        onClick={() => handleNavigation(item.path)}
        size="md"
        width="100%"
      >
        {item.label}
      </Button>
    );
  };

  return (
    <Box minHeight="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      {/* Always visible header with hamburger menu */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex={1000}
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <HStack p={4} justify="space-between" align="center">
          <IconButton
            icon={<FiMenu />}
            variant="outline"
            colorScheme="blue"
            onClick={() => {
              console.log('EnhancedLayout: Hamburger menu clicked!');
              onOpen();
            }}
            aria-label="Open menu"
            size="lg"
          />
          <Text fontSize="xl" fontWeight="bold" color="blue.500">
            TASK1 App
          </Text>
          <Box w="40px" />
        </HStack>
      </Box>

      {/* Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Text fontSize="lg" fontWeight="bold">
              Navigation
            </Text>
          </DrawerHeader>
          <DrawerBody p={4}>
            <VStack spacing={3} align="stretch">
              {navItems.map((item) => (
                <NavButton key={item.path} item={item} />
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box pt="80px" p={4}>
        {children}
      </Box>
    </Box>
  );
};

export default EnhancedLayout;