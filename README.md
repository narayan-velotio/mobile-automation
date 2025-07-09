# Mobile Automation Framework

A mobile automation testing framework built with WebdriverIO, Appium, and UiAutomator2 for Android and iOS mobile application testing.

## 📁 Current Project Structure

```
mobile-automation/
├── test/
│   └── specs/           # Test specifications
│       └── android-findElements.js
├── app/                 # Mobile applications
│   ├── android/         # Android APK files
│   │   ├── ApiDemos-debug.apk
│   │   └── ColorNote Notepad.apk
│   └── ios/             # iOS app files
│       ├── UIKitCatalog.zip
│       └── MVCTodo.zip
├── wdio.conf.js         # WebdriverIO configuration
├── package.json         # Project dependencies
├── .gitignore          # Git ignore rules
├── Makefile            # Project management commands
└── README.md           # Project documentation
```

## 🛠️ Current Files

### Configuration Files
- **`wdio.conf.js`**: WebdriverIO configuration with Appium and UiAutomator2 setup
- **`package.json`**: Project dependencies and scripts
- **`.gitignore`**: Git ignore rules for mobile automation project
- **`Makefile`**: Common commands for project management

### Test Files
- **`test/specs/android-findElements.js`**: Android element finding test specifications

### App Files
- **`app/android/ApiDemos-debug.apk`**: Android demo app for testing
- **`app/android/ColorNote Notepad.apk`**: Android note-taking app
- **`app/ios/UIKitCatalog.zip`**: iOS UIKit catalog app
- **`app/ios/MVCTodo.zip`**: iOS Todo app

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Android SDK with ADB
- Android Emulator or physical device

### Installation
```bash
# Install dependencies
npm install

# Check connected devices
adb devices

# Run tests
npm run wdio
```

## ⚙️ Current Configuration

The framework is configured for:
- **Platform**: Android
- **Automation**: UiAutomator2
- **Framework**: Mocha
- **Reporters**: Spec reporter
- **Services**: Appium

### WebdriverIO Configuration
```javascript
capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Pixel3',
    'appium:platformVersion': '16',
    'appium:app': path.join(process.cwd(), './app/android/ApiDemos-debug.apk'),
    'appium:chromedriverAutodownload': true,
}]
```

## 🔧 Available Commands

### Using npm
```bash
npm run wdio                    # Run all tests
npm install                     # Install dependencies
```

### Using Makefile
```bash
make help                       # Show all available commands
make install                    # Install dependencies
make setup                      # Setup project
make test                       # Run all tests
make devices                    # List connected devices
make clean                      # Clean generated files
```

## 📝 Current Test Structure

### Test Specifications
- **Android Find Elements**: `test/specs/android-findElements.js`
  - Tests for finding elements by accessibility ID
  - Tests for finding elements by class name
  - Tests for finding elements by XPath

## 🐛 Troubleshooting

### Common Issues
1. **Device Not Found**: Run `adb devices` to verify connection
2. **Appium Issues**: Check if Appium server is running
3. **APK Issues**: Ensure valid APK file in `app/android/` directory

### Debug Mode
```bash
npm run wdio -- --logLevel debug
``` 