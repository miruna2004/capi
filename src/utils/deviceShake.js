import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

class DeviceShakeDetector {
  constructor() {
    this.listeners = [];
    this.isListening = false;
    this.lastShakeTime = 0;
    this.shakeThreshold = 15; // Acceleration threshold
    this.shakeCooldown = 1000; // 1 second cooldown
    this.hasPermission = false;
    
    // Bind methods
    this.handleDeviceMotion = this.handleDeviceMotion.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  async requestPermission() {
    if (!Capacitor.isNativePlatform()) {
      console.log('DeviceShake: Web platform, no permission needed');
      this.hasPermission = true;
      return true;
    }

    try {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        console.log('DeviceShake: Requesting device motion permission...');
        const permission = await DeviceMotionEvent.requestPermission();
        this.hasPermission = permission === 'granted';
        console.log('DeviceShake: Permission result:', permission);
        return this.hasPermission;
      } else {
        console.log('DeviceShake: No permission request needed');
        this.hasPermission = true;
        return true;
      }
    } catch (error) {
      console.error('DeviceShake: Permission request failed:', error);
      this.hasPermission = false;
      return false;
    }
  }

  async enableListening() {
    console.log('DeviceShake: Enabling listening...');
    
    // Request permission first
    const hasPermission = await this.requestPermission();
    if (!hasPermission && Capacitor.isNativePlatform()) {
      console.log('DeviceShake: Permission denied, falling back to manual triggers');
    }
    
    this.isListening = true;
    
    if (Capacitor.isNativePlatform()) {
      // On native platforms, use device motion if available and permitted
      if (window.DeviceMotionEvent && this.hasPermission) {
        window.addEventListener('devicemotion', this.handleDeviceMotion);
        console.log('DeviceShake: Native device motion enabled');
      } else {
        console.log('DeviceShake: Device motion not available or no permission');
      }
    } else {
      // On web, use keyboard simulation
      document.addEventListener('keydown', this.handleKeyPress);
      console.log('DeviceShake: Web simulation enabled (press S key)');
    }
    
    return Promise.resolve();
  }
  
  async stopListening() {
    console.log('DeviceShake: Stopping listening...');
    this.isListening = false;
    
    if (Capacitor.isNativePlatform()) {
      window.removeEventListener('devicemotion', this.handleDeviceMotion);
    } else {
      document.removeEventListener('keydown', this.handleKeyPress);
    }
    
    return Promise.resolve();
  }
  
  async addListener(eventName, listenerFunc) {
    console.log('DeviceShake: Adding listener for', eventName);
    if (eventName === 'shake') {
      this.listeners.push(listenerFunc);
      return {
        remove: () => {
          const index = this.listeners.indexOf(listenerFunc);
          if (index > -1) {
            this.listeners.splice(index, 1);
          }
        }
      };
    }
    throw new Error('Only "shake" event is supported');
  }
  
  async removeAllListeners() {
    this.listeners = [];
    console.log('DeviceShake: All listeners removed');
    return Promise.resolve();
  }

  // Manual shake trigger for testing
  async manualShake() {
    console.log('DeviceShake: Manual shake triggered!');
    this.triggerShake();
  }
  
  handleDeviceMotion(event) {
    if (!this.isListening) return;
    
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;
    
    const { x, y, z } = acceleration;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    const currentTime = Date.now();
    
    if (magnitude > this.shakeThreshold && 
        (currentTime - this.lastShakeTime) > this.shakeCooldown) {
      this.lastShakeTime = currentTime;
      console.log('DeviceShake: Shake detected via device motion!', { magnitude });
      this.triggerShake();
    }
  }
  
  handleKeyPress(event) {
    if (!this.isListening) return;
    
    if (event.key.toLowerCase() === 's') {
      const currentTime = Date.now();
      if ((currentTime - this.lastShakeTime) > this.shakeCooldown) {
        this.lastShakeTime = currentTime;
        console.log('DeviceShake: Shake simulated via S key press!');
        this.triggerShake();
      }
    }
  }
  
  async triggerShake() {
    console.log('DeviceShake: Triggering shake event...');
    
    // Provide haptic feedback using Capacitor Haptics
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
        console.log('DeviceShake: Haptic feedback triggered');
      }
    } catch (error) {
      console.log('DeviceShake: Haptics not available:', error);
    }
    
    // Notify all listeners
    this.notifyListeners();
  }
  
  notifyListeners() {
    console.log('DeviceShake: Notifying', this.listeners.length, 'listeners');
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in shake listener:', error);
      }
    });
  }
}

// Create a single instance
const deviceShakeDetector = new DeviceShakeDetector();

// Export as DeviceShake for compatibility
export const DeviceShake = {
  enableListening: () => deviceShakeDetector.enableListening(),
  stopListening: () => deviceShakeDetector.stopListening(),
  addListener: (eventName, listenerFunc) => deviceShakeDetector.addListener(eventName, listenerFunc),
  removeAllListeners: () => deviceShakeDetector.removeAllListeners(),
  manualShake: () => deviceShakeDetector.manualShake() // Add manual shake for testing
}; 