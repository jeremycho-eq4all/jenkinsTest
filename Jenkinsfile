pipeline {
    agent any
    environment {
        CI = 'true'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/jeremycho-eq4all/jenkinsTest.git', credentialsId: 'github-token'
                echo 'Checkout completed'
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                    echo 'Dependencies installed'
                }
            }
        }
        stage('Start Server and Run Tests') {
            steps {
                script {
                    // Ensure the server is not already running
                    try {
                        echo 'Checking if the server is already running...'
                        if (isUnix()) {
                            sh 'netstat -tuln | grep :3010 | awk \'{print $7}\' | cut -d\'/\' -f1 | xargs kill -9 || true'
                        } else {
                            bat 'for /F "tokens=5" %i in (\'netstat -aon ^| findstr :3010 ^| findstr LISTENING\') do taskkill /F /PID %i'
                        }
                        echo 'Previous server instances killed'
                    } catch (Exception e) {
                        echo "No existing server to kill."
                    }
                    // Start the server in the background
                    echo 'Starting the server...'
                    sh 'nohup npm start &'
                    // Wait for the server to start (you might need to adjust the sleep time)
                    sleep 10
                    echo 'Server started, running tests...'
                    // Run the tests
                    sh 'npm test'
                }
            }
        }
    }
    post {
        always {
            script {
                echo 'Post build actions started'
                // Ensure the server is stopped after the tests
                try {
                    if (isUnix()) {
                        sh 'netstat -tuln | grep :3010 | awk \'{print $7}\' | cut -d\'/\' -f1 | xargs kill -9 || true'
                    } else {
                        bat 'for /F "tokens=5" %i in (\'netstat -aon ^| findstr :3010 ^| findstr LISTENING\') do taskkill /F /PID %i'
                    }
                    echo 'Server instances killed'
                } catch (Exception e) {
                    echo "No existing server to kill."
                }
                junit 'test-results.xml'
                archiveArtifacts artifacts: '**/test-results.xml', allowEmptyArchive: true
                echo 'Post build actions completed'
            }
        }
    }
}
