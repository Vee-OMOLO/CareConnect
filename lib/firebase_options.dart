import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart' show defaultTargetPlatform, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  // PLACEHOLDER CONFIGURATION: Replace strings with actual credentials from your Firebase Console

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyCNN9HqMg8jVuyQtZGnomoLpR4mTq34kLY',
    appId: '1:686286286759:android:aa6e2c8d4d7a15a7b2d082',
    messagingSenderId: '686286286759',
    projectId: 'careconnect-b8fad',
    storageBucket: 'careconnect-b8fad.firebasestorage.app',
  );
  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyYourMockApiKeyHere_iOSValues',
    appId: '1:1234567890:ios:f6e5d4c3b2a1',
    messagingSenderId: '1234567890',
    projectId: 'care-connect-mock-id',
    storageBucket: 'care-connect-mock-id.appspot.com',
    iosBundleId: 'com.example.careConnect',
  );
}
