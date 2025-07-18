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
        
        stage('Install Allure') {
            steps {
                script {
                    // Install Allure command line tool without sudo
                    sh '''
                        if ! command -v allure &> /dev/null; then
                            echo "Installing Allure command line tool..."
                            # Create directory for Allure
                            mkdir -p $HOME/allure
                            
                            # Download and install Allure to user directory
                            curl -o allure-2.24.1.tgz -Ls https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline/2.24.1/allure-commandline-2.24.1.tgz
                            tar -zxvf allure-2.24.1.tgz -C $HOME/allure/
                            
                            # Add to PATH for this session
                            export PATH=$PATH:$HOME/allure/allure-2.24.1/bin
                            echo "export PATH=\$PATH:\$HOME/allure/allure-2.24.1/bin" >> $HOME/.bashrc
                            
                            rm allure-2.24.1.tgz
                            echo "Allure installed successfully in $HOME/allure/"
                        else
                            echo "Allure is already installed"
                        fi
                        
                        # Use the installed Allure
                        $HOME/allure/allure-2.24.1/bin/allure --version || echo "Allure version check failed"
                    '''
                }
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
        
        stage('Generate Allure Report') {
            steps {
                script {
                    // Generate Allure HTML report using the installed version
                    sh '''
                        export PATH=$PATH:$HOME/allure/allure-2.24.1/bin
                        $HOME/allure/allure-2.24.1/bin/allure generate allure-results --clean -o allure-report
                    '''
                    
                    // Archive test results and reports
                    archiveArtifacts artifacts: 'allure-results/**/*', fingerprint: true
                    archiveArtifacts artifacts: 'allure-report/**/*', fingerprint: true
                    archiveArtifacts artifacts: 'screenshots/**/*', fingerprint: true, allowEmptyArchive: true
                    archiveArtifacts artifacts: '*.log', fingerprint: true, allowEmptyArchive: true
                }
                
                // Publish Allure report to Jenkins UI
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