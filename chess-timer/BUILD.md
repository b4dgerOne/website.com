# Building Chess Timer APK

The native Android project is now fully generated. You can build the APK directly with Gradle.

## Prerequisites

- Android SDK (API level 34+) 
- Java 17 or higher
- Gradle (included via wrapper)

## Build Instructions

### Option 1: Using Gradle Wrapper (Recommended)

```bash
cd chess-timer/android

# Build debug APK (fastest, for testing)
./gradlew assembleDebug

# Build release APK (optimized, for distribution)
./gradlew assembleRelease
```

Output APKs:
- Debug: `chess-timer/android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `chess-timer/android/app/build/outputs/apk/release/app-release.apk`

### Option 2: Using Android Studio

1. Open Android Studio
2. Select "Open an existing Android Studio project"
3. Navigate to `chess-timer/android`
4. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"

### Option 3: Command Line (Linux/Mac)

```bash
cd chess-timer/android
chmod +x gradlew
./gradlew assembleDebug
```

### Option 4: Windows Command Prompt

```cmd
cd chess-timer\android
gradlew.bat assembleDebug
```

## Install on Device/Emulator

### Via Gradle (automatic):
```bash
./gradlew installDebug
```

### Via ADB (manual):
```bash
adb install chess-timer/android/app/build/outputs/apk/debug/app-debug.apk
```

## Release Build (Signing)

For distribution, you'll need to sign the APK. Edit `chess-timer/android/app/build.gradle` to add:

```gradle
signingConfigs {
    release {
        storeFile file('/path/to/keystore.jks')
        storePassword 'your_keystore_password'
        keyAlias 'your_key_alias'
        keyPassword 'your_key_password'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
    }
}
```

Then build: `./gradlew assembleRelease`

## Troubleshooting

**"Could not find Android SDK":**
- Set `ANDROID_HOME` environment variable to your SDK location
- Example: `export ANDROID_HOME=~/Android/Sdk`

**Gradle build fails:**
- Clear cache: `./gradlew clean`
- Run: `./gradlew assembleDebug` again

**APK installation fails:**
- Ensure device/emulator is connected: `adb devices`
- Try uninstalling first: `adb uninstall com.anonymous.chesstimer`

## Notes

- The debug build includes test certificates and is unsigned
- Debug builds are ~40MB, release builds are much smaller after proguard
- Package name: `com.anonymous.chesstimer` (change in `app.json` if needed)
- Minimum SDK: Android 8.0 (API 26)
- Target SDK: Android 15 (API 35)
