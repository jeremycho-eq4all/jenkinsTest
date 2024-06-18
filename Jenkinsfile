pipeline {
    agent any

    environment {
        CI = 'true'
    }

    options {
        timeout(time: 30, unit: 'MINUTES') // 전체 파이프라인에 타임아웃 설정
    }

    stages {
        stage('Checkout') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    git branch: 'main', url: 'https://github.com/jeremycho-eq4all/jenkinsTest.git', credentialsId: 'github-token'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    sh 'npm install'
                    sh 'npm audit fix --force || true' 
                }
            }
        }

        stage('Start Server and Run Tests') {
            steps {
                script {
                    timeout(time: 1, unit: 'MINUTES') {
                        echo 'Checking if the server is already running...'
                        if (isUnix()) {
                            sh '''
                                netstat -tuln | grep :3010 | awk '{print $7}' | cut -d/ -f1 | xargs kill -9 || true
                            '''
                        } else {
                            bat '''
                                netstat -ano | findstr :3010 | awk '{print $5}' | xargs taskkill /F /PID || true
                            '''
                        }
                        echo 'Previous server instances killed'
                    }

                    timeout(time: 1, unit: 'MINUTES') {
                        echo 'Starting the server...'
                        sh 'nohup npm start &'
                        sleep 10
                        echo 'Server started, running tests...'
                        sh 'npm test'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                timeout(time: 1, unit: 'MINUTES') {
                    sh 'if [ -f .pidfile ]; then kill $(cat .pidfile) || true; fi'
                }
            }
            junit 'test-results.xml'
            archiveArtifacts artifacts: 'test-results.xml', allowEmptyArchive: true
        }
        success {
            mail to: 'jeremycho@eq4all.co.kr',
                 subject: "Success: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                 body: "Good job! The build was successful."
        }
        failure {
            mail to: 'jeremycho@eq4all.co.kr',
                 subject: "Failed: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                 body: "Oops! The build failed. Please check the logs."
        }
    }
}
