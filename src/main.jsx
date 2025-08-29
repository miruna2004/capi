import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Capacitor } from '@capacitor/core';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { SplashScreen } from '@capacitor/splash-screen';

// Import Firebase for web
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase/config';

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

const queryClient = new QueryClient();

// Initialize Firebase for web
if (!Capacitor.isNativePlatform()) {
  initializeApp(firebaseConfig);
}

// Initialize SafeArea plugin and hide splash screen when app is ready
const initializeCapacitorApp = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Get safe area insets and apply them
      const safeArea = await SafeArea.getSafeAreaInsets();
      
      // Apply safe area insets to CSS custom properties
      document.documentElement.style.setProperty('--safe-area-inset-top', `${safeArea.insets.top}px`);
      document.documentElement.style.setProperty('--safe-area-inset-right', `${safeArea.insets.right}px`);
      document.documentElement.style.setProperty('--safe-area-inset-bottom', `${safeArea.insets.bottom}px`);
      document.documentElement.style.setProperty('--safe-area-inset-left', `${safeArea.insets.left}px`);
      
      console.log('Safe area insets applied:', safeArea.insets);
    } catch (error) {
      console.error('Error initializing native features:', error);
    }
  }
};

// Hide splash screen after React app is fully rendered
const hideSplashScreen = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Add a small delay to ensure the app is fully rendered
      setTimeout(async () => {
        await SplashScreen.hide();
        console.log('Splash screen hidden');
      }, 1000);
    } catch (error) {
      console.error('Error hiding splash screen:', error);
    }
  }
};

// Initialize and render the app
initializeCapacitorApp().then(() => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
  
  // Hide splash screen after React app is rendered
  hideSplashScreen();
});