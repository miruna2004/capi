#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(DeviceShakePlugin, "DeviceShake",
    CAP_PLUGIN_METHOD(enableListening, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(stopListening, CAPPluginReturnPromise);
) 