import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Switch,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Stat,
  StatLabel,
  StatNumber
} from '@chakra-ui/react';
import { useDeviceShake } from '../hooks/useDeviceShake';
import { useAuth } from '../contexts/AuthContext';
import { DeviceShake } from '../utils/deviceShake';
import { Capacitor } from '@capacitor/core';

export function ShakeDetectionDemo() {
  const { currentUser, logout } = useAuth();
  const toast = useToast();
  const [shakeCount, setShakeCount] = useState(0);
  const [enabledForUnauthenticated, setEnabledForUnauthenticated] = useState(false);
  const [showLogoutPromptOnShake, setShowLogoutPromptOnShake] = useState(true);
  const [hasMotionPermission, setHasMotionPermission] = useState(false);

  const handleShake = async (action) => {
    console.log('ShakeDetectionDemo: Shake handled with action:', action);
    
    // Always increment shake count first, before any other actions
    setShakeCount(prev => {
      const newCount = prev + 1;
      console.log('ShakeDetectionDemo: Shake count increased to:', newCount);
      return newCount;
    });
    
    // Show toast notification
    toast({
      title: 'Shake detected!',
      description: `Device shake #${shakeCount + 1} detected`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    
    if (action === 'logout') {
      // Handle logout after showing the count increase
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been logged out due to shake detection',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const { isEnabled, enableShakeDetection, disableShakeDetection } = useDeviceShake(
    handleShake,
    {
      enabledForUnauthenticated,
      showLogoutPromptOnShake
    }
  );

  const handleManualShake = async () => {
    console.log('ShakeDetectionDemo: Manual shake button clicked');
    try {
      await DeviceShake.manualShake();
    } catch (error) {
      console.error('Manual shake failed:', error);
    }
  };

  const requestMotionPermission = async () => {
    console.log('ShakeDetectionDemo: Requesting motion permission...');
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        const permission = await DeviceMotionEvent.requestPermission();
        console.log('ShakeDetectionDemo: Permission result:', permission);
        
        if (permission === 'granted') {
          setHasMotionPermission(true);
          toast({
            title: 'Permission Granted!',
            description: 'You can now use Device → Shake Gesture from the simulator menu',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
          
          // Re-enable shake detection with new permissions
          await disableShakeDetection();
          await enableShakeDetection();
        } else {
          toast({
            title: 'Permission Denied',
            description: 'Device motion access was denied',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: 'Not Needed',
          description: 'Permission request not required on this platform',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      toast({
        title: 'Permission Request Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEnable = async () => {
    console.log('ShakeDetectionDemo: Enable button clicked');
    try {
      await enableShakeDetection();
      toast({
        title: 'Shake Detection Enabled',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Enable failed:', error);
    }
  };

  const handleDisable = async () => {
    console.log('ShakeDetectionDemo: Disable button clicked');
    try {
      await disableShakeDetection();
      toast({
        title: 'Shake Detection Disabled',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Disable failed:', error);
    }
  };

  const isNative = Capacitor.isNativePlatform();

  return (
    <Box p={6} maxWidth="500px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Card>
          <CardHeader>
            <Heading size="md" textAlign="center">
              🤳 Shake Detection Demo
            </Heading>
            <Text textAlign="center" color="gray.600" mt={2}>
              Test the device shake detection plugin
            </Text>
          </CardHeader>
          
          <CardBody>
            <VStack spacing={4} align="stretch">
              {/* Authentication Status */}
              <Alert status={currentUser ? 'success' : 'warning'}>
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {currentUser ? 'Authenticated' : 'Not Authenticated'}
                  </AlertTitle>
                  <AlertDescription>
                    {currentUser 
                      ? `Logged in as: ${currentUser.email || 'User'}`
                      : 'Please log in to enable shake detection'
                    }
                  </AlertDescription>
                </Box>
              </Alert>

              <Divider />

              {/* Shake Detection Status */}
              <HStack justify="space-between" align="center">
                <Text fontWeight="semibold">Shake Detection:</Text>
                <Badge colorScheme={isEnabled ? 'green' : 'red'}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </HStack>

              {/* Shake Count */}
              <Stat>
                <StatLabel>Shake Count:</StatLabel>
                <StatNumber>{shakeCount}</StatNumber>
              </Stat>

              <Divider />

              {/* Permission Request for iOS */}
              {isNative && (
                <>
                  <VStack spacing={3}>
                    <Text fontWeight="semibold">Device Motion Permission:</Text>
                    <Button
                      colorScheme="blue"
                      size="md"
                      onClick={requestMotionPermission}
                      width="100%"
                    >
                      🔑 Request Motion Permission
                    </Button>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Required for simulator "Device → Shake Gesture" to work
                    </Text>
                  </VStack>
                  <Divider />
                </>
              )}

              {/* Manual Test Button */}
              <VStack spacing={3}>
                <Text fontWeight="semibold">Quick Test:</Text>
                <Button
                  colorScheme="purple"
                  size="lg"
                  onClick={handleManualShake}
                  width="100%"
                >
                  🎯 Test Shake Now!
                </Button>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Click this button to simulate a shake event
                </Text>
              </VStack>

              <Divider />

              {/* Settings */}
              <VStack spacing={3} align="stretch">
                <Text fontWeight="semibold" mb={2}>Settings:</Text>
                
                {!currentUser && (
                  <HStack justify="space-between" align="center">
                    <Text fontSize="sm">
                      Enable for unauthenticated users
                    </Text>
                    <Switch
                      isChecked={enabledForUnauthenticated}
                      onChange={(e) => {
                        console.log('ShakeDetectionDemo: Toggle unauthenticated setting:', e.target.checked);
                        setEnabledForUnauthenticated(e.target.checked);
                      }}
                    />
                  </HStack>
                )}

                {currentUser && (
                  <VStack spacing={2} align="stretch">
                    <HStack justify="space-between" align="center">
                      <Text fontSize="sm">
                        Show logout prompt on shake
                      </Text>
                      <Switch
                        isChecked={showLogoutPromptOnShake}
                        onChange={(e) => {
                          console.log('ShakeDetectionDemo: Toggle logout prompt setting:', e.target.checked);
                          setShowLogoutPromptOnShake(e.target.checked);
                        }}
                      />
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      Turn off to test shake counting without logout prompts
                    </Text>
                  </VStack>
                )}
              </VStack>

              <Divider />

              {/* Manual Controls */}
              <VStack spacing={3}>
                <Text fontWeight="semibold">Manual Controls:</Text>
                <HStack spacing={3} width="100%">
                  <Button
                    size="md"
                    colorScheme="green"
                    onClick={handleEnable}
                    isDisabled={isEnabled}
                    flex={1}
                  >
                    Enable
                  </Button>
                  <Button
                    size="md"
                    colorScheme="red"
                    onClick={handleDisable}
                    isDisabled={!isEnabled}
                    flex={1}
                  >
                    Disable
                  </Button>
                </HStack>
                
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => {
                    console.log('ShakeDetectionDemo: Reset count clicked');
                    setShakeCount(0);
                  }}
                  width="100%"
                >
                  Reset Count
                </Button>
              </VStack>

              {/* Instructions */}
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>How to test:</AlertTitle>
                  <AlertDescription>
                    • Use the purple "Test Shake Now!" button above<br/>
                    • On iOS: Click "Request Motion Permission" first, then use Device → Shake Gesture<br/>
                    • On web: Press the 'S' key to simulate shake
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
} 