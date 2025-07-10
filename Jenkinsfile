pipeline {
    agent any
    
    tools {
        nodejs 'Node_24'
    }
    
    environment {
        BROWSERSTACK_USERNAME = credentials('browserstack-username')
        BROWSERSTACK_ACCESS_KEY = credentials('browserstack-access-key')
        BROWSERSTACK_APP_ID = credentials('browserstack-app-id')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Upload App to BrowserStack') {
            steps {
                script {
                    // Debug: Check if APK file exists
                    sh '''
                        echo "Current working directory: $(pwd)"
                        echo "Checking if APK file exists..."
                        ls -la app/android/
                        if [ -f "app/android/ApiDemos-debug.apk" ]; then
                            echo "APK file found!"
                            ls -la app/android/ApiDemos-debug.apk
                        else
                            echo "APK file not found!"
                            exit 1
                        fi
                    '''
                    
                    // Upload the ApiDemos-debug.apk from app folder to BrowserStack
                    sh '''
                        curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
                        -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
                        -F "file=@app/android/ApiDemos-debug.apk" \
                        -F "custom_id=ApiDemosApp"
                    '''
                    
                    // Get the app ID from the response and set it as environment variable
                    sh '''
                        APP_ID=$(curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
                        -X GET "https://api-cloud.browserstack.com/app-automate/recent_apps" \
                        | jq -r '.[0].app_id')
                        echo "APP_ID=$APP_ID" >> $GITHUB_ENV
                    '''
                }
            }
        }
        
        stage('Run Tests on BrowserStack') {
            steps {
                script {
                    // Update the config file with the actual app ID
                    sh '''
                        sed -i "s|bs://84b3afac8eca289505505c4cb935495f52b3fde8|$APP_ID|g" wdio.browserstack.conf.js
                    '''
                    
                    // Run tests using the existing android-findElements.js test
                    sh 'npm run test:browserstack'
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                sh 'npm run report'
                
                // Archive test results
                archiveArtifacts artifacts: 'allure-results/**/*', fingerprint: true
                
                // Publish Allure report
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-results']]
                ])
            }
        }
    }
    
    post {
        always {
            // Clean up
            sh 'rm -rf node_modules'
            
            // Send notification
            script {
                if (currentBuild.result == 'SUCCESS') {
                    echo 'Tests passed successfully!'
                } else {
                    echo 'Tests failed!'
                }
            }
        }
        
        success {
            echo 'Pipeline completed successfully!'
        }
        
        failure {
            echo 'Pipeline failed!'
        }
    }
} 