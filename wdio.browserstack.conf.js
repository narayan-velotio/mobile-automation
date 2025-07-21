const path = require('path');

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
    
    // BrowserStack credentials with debugging
    user: process.env.BROWSERSTACK_USERNAME || (() => {
        console.error('BROWSERSTACK_USERNAME is not set');
        return '';
    })(),
    key: process.env.BROWSERSTACK_ACCESS_KEY || (() => {
        console.error('BROWSERSTACK_ACCESS_KEY is not set');
        return '';
    })(),
    
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
        const username = process.env.BROWSERSTACK_USERNAME;
        const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
        
        console.log('BrowserStack Configuration:');
        console.log('Username:', username ? `${username.substring(0, 3)}***` : 'NOT SET');
        console.log('Access Key:', accessKey ? `${accessKey.substring(0, 5)}***` : 'NOT SET');
        console.log('Config user:', this.user ? `${this.user.substring(0, 3)}***` : 'NOT SET');
        console.log('Config key:', this.key ? `${this.key.substring(0, 5)}***` : 'NOT SET');
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