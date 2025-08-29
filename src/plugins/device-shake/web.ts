import { WebPlugin } from '@capacitor/core';
import type { DeviceShakePlugin } from './definitions';

export class DeviceShakeWeb extends WebPlugin implements DeviceShakePlugin {
  private isListening = false;
  private listeners: Array<() => void> = [];

  async enableListening(): Promise<void> {
    console.log('DeviceShake: Web implementation - listening enabled (keyboard simulation)');
    this.isListening = true;
    
    // Add keyboard simulation for testing (press 'S' key to simulate shake)
    document.addEventListener('keydown', this.handleKeyPress);
  }

  async stopListening(): Promise<void> {
    console.log('DeviceShake: Web implementation - listening disabled');
    this.isListening = false;
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  async addListener(eventName: 'shake', listenerFunc: () => void): Promise<any> {
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

  async removeAllListeners(): Promise<void> {
    this.listeners = [];
    console.log('DeviceShake: All listeners removed');
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 's' && this.isListening) {
      console.log('DeviceShake: Simulated shake detected (S key pressed)');
      this.notifyListeners();
    }
  };

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in shake listener:', error);
      }
    });
  }
} 