pipeline {
    agent any
    environment {
        CI = 'true'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/jeremycho-eq4all/jenkinsTest.git', credentialsId: 'github-token'
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    // Ensure the server is not already running
                    try {
                        if (isUnix()) {
                            sh 'netstat -tuln | grep :3010 | awk \'{print $7}\' | cut -d\'/\' -f1 | xargs kill -9 || true'
                        } else {
                            bat 'for /F "tokens=5" %i in (\'netstat -aon ^| findstr :3010 ^| findstr LISTENING\') do taskkill /F /PID %i'
                        }
                    } catch (Exception e) {
                        echo "No existing server to kill."
                    }
                    // Start the server and run tests
                    sh 'nohup npm start &'
                    sh 'npm test'
                }
            }
        }
    }
    post {
        always {
            script {
                // Ensure the server is stopped after the tests
                try {
                    if (isUnix()) {
                        sh 'netstat -tuln | grep :3010 | awk \'{print $7}\' | cut -d\'/\' -f1 | xargs kill -9 || true'
                    } else {
                        bat 'for /F "tokens=5" %i in (\'netstat -aon ^| findstr :3010 ^| findstr LISTENING\') do taskkill /F /PID %i'
                    }
                } catch (Exception e) {
                    echo "No existing server to kill."
                }
                junit 'test-results.xml'
                archiveArtifacts artifacts: '**/test-results.xml', allowEmptyArchive: true
            }
        }
    }
}
