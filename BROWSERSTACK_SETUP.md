# BrowserStack + Jenkins Setup Guide

## Prerequisites

1. **BrowserStack Account**: You need a BrowserStack account with App Automate access
2. **Jenkins Server**: Jenkins should be installed and configured
3. **Git Repository**: Your code should be in a Git repository

## Step 1: Get BrowserStack Credentials

1. Log in to your BrowserStack account
2. Go to **Account Settings** → **Access Keys**
3. Note down your:
   - **Username**
   - **Access Key**

## Step 2: Upload Your App to BrowserStack

### Option A: Using BrowserStack Dashboard
1. Go to **App Automate** → **Upload App**
2. Upload your APK file (`app/android/ApiDemos-debug.apk`)
3. Note the **App ID** (format: `bs://xxxxxxxxxxxxxxxxxxxxxxxx`)

### Option B: Using API (Automated in Jenkins)
The Jenkins pipeline will automatically upload your `ApiDemos-debug.apk` from the app folder and get the App ID.

## Step 3: Configure Jenkins Credentials

1. In Jenkins, go to **Manage Jenkins** → **Manage Credentials**
2. Click **System** → **Global credentials** → **Add Credentials**
3. Add the following credentials:

### Username/Password Credentials
- **ID**: `browserstack-username`
- **Username**: Your BrowserStack username
- **Password**: Your BrowserStack access key

### Secret Text Credentials
- **ID**: `browserstack-access-key`
- **Secret**: Your BrowserStack access key

### Secret Text Credentials (App ID)
- **ID**: `browserstack-app-id`
- **Secret**: Your BrowserStack app ID (e.g., `bs://xxxxxxxxxxxxxxxxxxxxxxxx`)

## Step 4: Install Required Jenkins Plugins

Install these plugins in Jenkins:
1. **Pipeline** (usually pre-installed)
2. **Allure Jenkins Plugin**
3. **Credentials Plugin** (usually pre-installed)

## Step 5: Configure Environment Variables

Create a `.env` file in your project root (don't commit this file):

```bash
# BrowserStack Configuration
BROWSERSTACK_USERNAME=your_browserstack_username
BROWSERSTACK_ACCESS_KEY=your_browserstack_access_key
BROWSERSTACK_APP_ID=bs://your_app_id_here

# Test Configuration
BUILD_NAME=Mobile Automation Test
SESSION_NAME=Android Find Elements Test
```

## Step 6: Test Files and App

### Test File
The pipeline will run your existing test: `test/specs/android-findElements.js`

This test includes:
- Finding elements by accessibility id
- Finding elements by class name  
- Finding elements by xpath
- Testing app interactions and assertions

### App File
The pipeline will use: `app/android/ApiDemos-debug.apk`

## Step 7: Create Jenkins Pipeline

1. In Jenkins, create a new **Pipeline** job
2. Configure the pipeline to use the `Jenkinsfile` from your repository
3. Set up the pipeline to run on your desired schedule or trigger

## Step 8: Test the Setup

### Local Testing
Before running in Jenkins, test locally:

```bash
# Set environment variables
export BROWSERSTACK_USERNAME=your_username
export BROWSERSTACK_ACCESS_KEY=your_access_key

# Run tests
npm run test:browserstack
```

### Jenkins Testing
1. Trigger the Jenkins pipeline
2. Monitor the build logs
3. Check the Allure reports for test results

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify your BrowserStack credentials
   - Check if your account has App Automate access

2. **App Upload Failed**
   - Ensure your APK file exists at `app/android/ApiDemos-debug.apk`
   - Check file size limits (BrowserStack has upload limits)

3. **Tests Fail to Start**
   - Verify the app ID is correct
   - Check device availability in BrowserStack

4. **Jenkins Build Fails**
   - Check Jenkins logs for detailed error messages
   - Verify all required plugins are installed
   - Ensure credentials are properly configured

### Debug Mode

Enable debug mode in your BrowserStack configuration:

```javascript
'bstack:options': {
    debug: true,
    networkLogs: true,
    consoleLogs: 'verbose'
}
```

## Advanced Configuration

### Parallel Testing
To run tests in parallel, use:

```bash
npm run test:browserstack:parallel
```

### Multiple Devices
Add more capabilities to test on multiple devices:

```javascript
capabilities: [
    {
        'bstack:options': {
            deviceName: 'Samsung Galaxy S22',
            osVersion: '12.0',
            // ... other options
        }
    },
    {
        'bstack:options': {
            deviceName: 'iPhone 14',
            osVersion: '16',
            // ... other options
        }
    }
]
```

### Custom Reports
The pipeline generates Allure reports. Access them in Jenkins:
1. Go to your build
2. Click on **Allure Report** in the left sidebar

## Support

- **BrowserStack Documentation**: https://www.browserstack.com/app-automate
- **WebdriverIO Documentation**: https://webdriver.io/docs/browserstack-service
- **Jenkins Documentation**: https://www.jenkins.io/doc/ 