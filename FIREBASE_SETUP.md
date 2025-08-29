# Firebase Authentication Setup for Capacitor

This guide will help you set up Firebase Authentication for your Capacitor app with support for email/password, Google, and Apple sign-in.

## Prerequisites

1. A Firebase project created at [Firebase Console](https://console.firebase.google.com/)
2. Authentication enabled in your Firebase project
3. Google and Apple sign-in providers configured (for social authentication)

## Step 1: Configure Firebase Project

### Enable Authentication Providers

1. Go to your Firebase Console
2. Navigate to **Authentication** > **Sign-in method**
3. Enable the following providers:
   - **Email/Password**
   - **Google** (for social sign-in)
   - **Apple** (for iOS social sign-in)

### Configure OAuth Providers

#### Google Sign-In
1. In the Google provider settings, add your app's package names:
   - Android: `com.example.app`
   - iOS: `com.example.app`
2. Add your SHA-1 fingerprint for Android (see below for how to generate)

#### Apple Sign-In (iOS only)
1. Configure Apple Sign-In in your Apple Developer account
2. Add the Apple provider in Firebase with your Apple Team ID and Key ID

## Step 2: Download Configuration Files

### Android Configuration (google-services.json)

1. In Firebase Console, go to **Project Settings**
2. Select your Android app or add a new Android app with package name: `com.example.app`
3. Download the `google-services.json` file
4. Replace the placeholder file at: `android/app/google-services.json`

### iOS Configuration (GoogleService-Info.plist)

1. In Firebase Console, go to **Project Settings**
2. Select your iOS app or add a new iOS app with bundle ID: `com.example.app`
3. Download the `GoogleService-Info.plist` file
4. Replace the placeholder file at: `ios/App/App/GoogleService-Info.plist`

## Step 3: Generate SHA-1 Fingerprint (Android)

### Debug Keystore (for development)
```bash
# macOS/Linux
keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore -storepass android -keypass android

# Windows
keytool -list -v -alias androiddebugkey -keystore "%USERPROFILE%\.android\debug.keystore" -storepass android -keypass android
```

### Release Keystore (for production)
```bash
keytool -list -v -alias <your-key-alias> -keystore <path-to-your-keystore>
```

Add the SHA-1 fingerprint to your Firebase Android app configuration.

## Step 4: Update Bundle ID / Package Name (Optional)

If you want to use a different package name:

1. Update `capacitor.config.json`:
```json
{
  "appId": "your.new.package.name"
}
```

2. Update Android package name in `android/app/src/main/AndroidManifest.xml`
3. Update iOS bundle identifier in Xcode
4. Update Firebase app configurations to match the new package/bundle ID

## Step 5: Build and Test

### Build the app
```bash
npm run build
npx cap sync
```

### Test on iOS
```bash
npx cap open ios
```
Then build and run from Xcode.

### Test on Android
```bash
npx cap open android
```
Then build and run from Android Studio.

## Authentication Features

### Email/Password Authentication
- Sign up with email and password
- Sign in with email and password
- Display name support
- Error handling for common scenarios

### Google Sign-In
- Available on both iOS and Android
- Automatic account selection
- Seamless integration with Firebase

### Apple Sign-In
- Available on iOS only
- Native Apple authentication flow
- Privacy-focused authentication

## Testing Authentication

1. **Email/Password**: Create a new account and sign in
2. **Google**: Test Google sign-in flow (requires valid google-services configuration)
3. **Apple**: Test Apple sign-in on iOS device/simulator (requires Apple Developer account)

## Troubleshooting

### Common Issues

1. **"No matching client found for package name"**
   - Ensure your package name matches in Firebase console and app configuration
   - Verify google-services.json/GoogleService-Info.plist files are correctly placed

2. **Google Sign-In fails**
   - Check SHA-1 fingerprint is added to Firebase
   - Ensure Google provider is enabled in Firebase console
   - Verify google-services.json is valid

3. **Apple Sign-In fails**
   - Ensure Apple Sign-In is configured in Apple Developer account
   - Verify Apple provider is enabled in Firebase console
   - Test on physical iOS device (Apple Sign-In may not work in simulator)

4. **Authentication state not persisting**
   - Check if Firebase configuration files are properly loaded
   - Verify authentication listener is properly set up

### Debug Steps

1. Check browser/device console for error messages
2. Verify Firebase configuration in browser developer tools
3. Test authentication in Firebase console users section
4. Check Capacitor plugin installation: `npx cap ls`

## Production Considerations

1. **Generate production SHA-1 fingerprint** and add to Firebase
2. **Configure proper redirect URLs** for OAuth providers
3. **Set up proper error handling** and user feedback
4. **Implement proper logout flow** and session management
5. **Test thoroughly** on physical devices before release

## Current Configuration

- **Firebase Project**: django-todo-app-2fa33
- **Package Name**: com.example.app
- **Supported Platforms**: iOS, Android, Web
- **Authentication Methods**: Email/Password, Google, Apple (iOS only)

## Next Steps

1. Replace placeholder configuration files with your actual Firebase configuration
2. Test authentication flows on physical devices
3. Configure production keystore and update SHA-1 fingerprints
4. Set up proper error handling and user experience flows 