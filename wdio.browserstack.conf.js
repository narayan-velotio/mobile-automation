const path = require('path');

// Get BrowserStack credentials with validation
const getBrowserStackCredentials = () => {
    const username = process.env.BROWSERSTACK_USERNAME;
    const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
    
    if (!username) {
        throw new Error('BROWSERSTACK_USERNAME environment variable is not set');
    }
    if (!accessKey) {
        throw new Error('BROWSERSTACK_ACCESS_KEY environment variable is not set');
    }
    
    console.log('BrowserStack credentials validation:');
    console.log('Username length:', username.length);
    console.log('Access Key length:', accessKey.length);
    console.log('Username starts with:', username.substring(0, 3));
    console.log('Access Key starts with:', accessKey.substring(0, 5));
    
    return { username, accessKey };
};

const credentials = getBrowserStackCredentials();

exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    
    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './test/specs/**/*.js'
    ],
    
    exclude: [
        // 'path/to/excluded/files'
    ],
    
    //
    // ============
    // Capabilities
    // ============
    maxInstances: 1,
    
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'Samsung Galaxy S22',
        'appium:platformVersion': '12.0',
        'appium:automationName': 'UiAutomator2',
        'appium:app': 'bs://84b3afac8eca289505505c4cb935495f52b3fde8',
        'bstack:options': {
            buildName: 'Mobile Automation Test',
            sessionName: 'Android App Test',
            debug: true,
            networkLogs: true,
            local: false
        }
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    // BrowserStack service configuration
    services: [
        ['browserstack', {
            browserstackLocal: false
        }]
    ],
    
    // BrowserStack credentials - use the validated credentials
    user: credentials.username,
    key: credentials.accessKey,
    
    // Framework
    framework: 'mocha',
    
    // Reporters
    reporters: ['spec', ['allure', {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
    }]],

    // Mocha options
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    //
    // =====
    // Hooks
    // =====
    before: function (capabilities, specs) {
        // Debug: Print credentials (masked)
        console.log('BrowserStack Configuration in before hook:');
        console.log('Username:', this.user ? `${this.user.substring(0, 3)}***` : 'NOT SET');
        console.log('Access Key:', this.key ? `${this.key.substring(0, 5)}***` : 'NOT SET');
    },

    after: function (result, capabilities, specs) {
        // Add any cleanup code here
    },

    afterTest: function(test, context, { error, result, duration, passed, retries }) {
        if (error) {
            browser.takeScreenshot();
        }
    }
}; 