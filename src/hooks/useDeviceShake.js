import { useEffect, useRef } from 'react';
import { DeviceShake } from '../utils/deviceShake';
import { useAuth } from '../contexts/AuthContext';

export function useDeviceShake(onShake, options = {}) {
  const { currentUser } = useAuth();
  const listenerRef = useRef(null);
  const {
    enabledForUnauthenticated = false,
    showLogoutPromptOnShake = true
  } = options;

  console.log('useDeviceShake: Hook initialized', { 
    currentUser: !!currentUser, 
    enabledForUnauthenticated, 
    showLogoutPromptOnShake 
  });

  const enableShakeDetection = async () => {
    try {
      console.log('useDeviceShake: Enabling shake detection');
      
      // Enable shake listening
      await DeviceShake.enableListening();
      console.log('useDeviceShake: Listening enabled');
      
      // Add shake event listener
      listenerRef.current = await DeviceShake.addListener('shake', () => {
        console.log('useDeviceShake: Shake detected in listener!');
        
        if (!currentUser && !enabledForUnauthenticated) {
          console.log('useDeviceShake: Shake detection disabled for unauthenticated users');
          return;
        }

        if (showLogoutPromptOnShake && currentUser) {
          console.log('useDeviceShake: Showing logout prompt');
          // Show logout prompt when authenticated user shakes device
          if (window.confirm('Shake detected! Do you want to logout?')) {
            console.log('useDeviceShake: User confirmed logout');
            onShake?.('logout');
          }
        } else {
          console.log('useDeviceShake: Calling onShake handler');
          // Call the custom onShake handler
          onShake?.('shake');
        }
      });

      console.log('useDeviceShake: Shake detection enabled successfully');
    } catch (error) {
      console.error('useDeviceShake: Failed to enable shake detection:', error);
    }
  };

  const disableShakeDetection = async () => {
    try {
      console.log('useDeviceShake: Disabling shake detection');
      
      // Remove listeners
      if (listenerRef.current) {
        await listenerRef.current.remove();
        listenerRef.current = null;
        console.log('useDeviceShake: Listener removed');
      }
      
      // Stop listening
      await DeviceShake.stopListening();
      
      console.log('useDeviceShake: Shake detection disabled');
    } catch (error) {
      console.error('useDeviceShake: Failed to disable shake detection:', error);
    }
  };

  useEffect(() => {
    console.log('useDeviceShake: useEffect triggered', { currentUser: !!currentUser, enabledForUnauthenticated });
    
    // Clean up any existing listeners first
    DeviceShake.removeAllListeners();
    
    const shouldEnable = currentUser || enabledForUnauthenticated;
    console.log('useDeviceShake: Should enable shake detection?', shouldEnable);
    
    if (shouldEnable) {
      // Enable shake detection based on authentication state and settings
      enableShakeDetection();
    } else {
      disableShakeDetection();
    }

    // Cleanup on unmount
    return () => {
      console.log('useDeviceShake: Cleaning up');
      disableShakeDetection();
    };
  }, [currentUser, enabledForUnauthenticated, showLogoutPromptOnShake]);

  return {
    isEnabled: currentUser || enabledForUnauthenticated,
    enableShakeDetection,
    disableShakeDetection
  };
} 