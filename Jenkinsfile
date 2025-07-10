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
        
        stage('Run Tests on BrowserStack') {
            steps {
                script {
                    // Use the existing app ID directly (no upload needed)
                    sh '''
                        echo "Using existing app ID: $BROWSERSTACK_APP_ID"
                        sed -i "s|bs://84b3afac8eca289505505c4cb935495f52b3fde8|$BROWSERSTACK_APP_ID|g" wdio.browserstack.conf.js
                    '''
                    
                    // Run tests using the existing android-findElements.js test with explicit environment variables
                    sh '''
                        export BROWSERSTACK_USERNAME="$BROWSERSTACK_USERNAME"
                        export BROWSERSTACK_ACCESS_KEY="$BROWSERSTACK_ACCESS_KEY"
                        npm run test:browserstack
                    '''
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