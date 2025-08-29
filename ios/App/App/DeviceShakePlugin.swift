import Foundation
import Capacitor
import CoreMotion
import UIKit

@objc(DeviceShakePlugin)
public class DeviceShakePlugin: CAPPlugin, CAPBridgedPlugin {
    
    public let identifier = "DeviceShakePlugin"
    public let jsName = "DeviceShake"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "enableListening", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopListening", returnType: CAPPluginReturnPromise)
    ]
    
    private var motionManager: CMMotionManager?
    private var isListening = false
    private let shakeThreshold = 2.5
    private var lastShakeTime: TimeInterval = 0
    private let shakeCooldown: TimeInterval = 1.0
    
    override public func load() {
        motionManager = CMMotionManager()
        print("DeviceShake: Plugin loaded successfully")
    }
    
    @objc func enableListening(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if self.isListening {
                print("DeviceShake: Already listening")
                call.resolve()
                return
            }
            
            guard let motionManager = self.motionManager else {
                print("DeviceShake: Motion manager not available")
                call.reject("Motion manager not available")
                return
            }
            
            if !motionManager.isAccelerometerAvailable {
                print("DeviceShake: Accelerometer not available")
                call.reject("Accelerometer not available")
                return
            }
            
            self.isListening = true
            motionManager.accelerometerUpdateInterval = 0.1
            
            motionManager.startAccelerometerUpdates(to: OperationQueue.main) { [weak self] (data, error) in
                guard let self = self,
                      let accelerometerData = data,
                      error == nil else { 
                    print("DeviceShake: Accelerometer error: \(error?.localizedDescription ?? "Unknown")")
                    return 
                }
                
                self.checkForShake(accelerometerData: accelerometerData)
            }
            
            print("DeviceShake: iOS listening enabled")
            call.resolve()
        }
    }
    
    @objc func stopListening(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if !self.isListening {
                print("DeviceShake: Already stopped")
                call.resolve()
                return
            }
            
            self.motionManager?.stopAccelerometerUpdates()
            self.isListening = false
            
            print("DeviceShake: iOS listening disabled")
            call.resolve()
        }
    }
    
    private func checkForShake(accelerometerData: CMAccelerometerData) {
        let acceleration = accelerometerData.acceleration
        let magnitude = sqrt(pow(acceleration.x, 2) + pow(acceleration.y, 2) + pow(acceleration.z, 2))
        
        let currentTime = Date().timeIntervalSince1970
        
        if magnitude > shakeThreshold && (currentTime - lastShakeTime) > shakeCooldown {
            lastShakeTime = currentTime
            print("DeviceShake: Shake detected on iOS!")
            
            // Trigger haptic feedback
            let impactGenerator = UIImpactFeedbackGenerator(style: .heavy)
            impactGenerator.impactOccurred()
            
            // Notify listeners
            notifyListeners("shake", data: [:])
        }
    }
    
    deinit {
        motionManager?.stopAccelerometerUpdates()
        print("DeviceShake: Plugin deinitialized")
    }
} 