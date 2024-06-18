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
                        sh '''
                        if lsof -i :3010; then
                            lsof -i :3010 | grep LISTEN | awk '{print $2}' | xargs kill -9
                        fi
                        '''
                        echo 'Previous server instances killed'
                    } catch (Exception e) {
                        echo "No existing server to kill."
                    }
                    // Start the server in the background and save the PID
                    echo 'Starting the server...'
                    sh 'nohup npm start & echo $! > .pidfile'
                    // Wait for the server to start
                    sleep 10
                    echo 'Server started, running tests...'
                    // Run the tests and save logs
                    sh 'npm test > test-output.log 2>&1'
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
                    sh 'kill $(cat .pidfile) || true'
                    echo 'Server instances killed'
                } catch (Exception e) {
                    echo "No existing server to kill."
                }
                archiveArtifacts artifacts: 'nohup.out, test-output.log, test-results.xml', allowEmptyArchive: true
                junit 'test-results.xml'
                echo 'Post build actions completed'
            }
        }
    }
}
