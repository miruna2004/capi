export interface DeviceShakePlugin {
  /**
   * Starts listening for shaking movements.
   */
  enableListening(): Promise<void>;

  /**
   * Stops listening for shaking movements.
   */
  stopListening(): Promise<void>;

  /**
   * Adds a listener for shake events.
   * @param eventName The event name - must be 'shake'
   * @param listenerFunc Function to call when shake is detected
   */
  addListener(eventName: 'shake', listenerFunc: () => void): Promise<any>;

  /**
   * Removes all shake event listeners.
   */
  removeAllListeners(): Promise<void>;
} 