pipeline {
    agent any

    environment {
        CI = 'true'
    }

    options {
        timeout(time: 10, unit: 'MINUTES') // 전체 파이프라인에 타임아웃 설정
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

        stage('Start Server') {
            steps {
                script {
                    // 기존 서버가 있다면 종료
                    sh '''
                        PID=$(netstat -tuln | grep ':3010' | awk '{print $7}' | cut -d'/' -f1)
                        if [ -n "$PID" ]; then
                            echo "Killing process $PID"
                            kill -9 $PID
                        fi
                    '''
                    // Node.js 서버를 백그라운드에서 시작하고 PID를 저장
                    sh 'nohup npm start & echo $! > .pidfile'
                }
            }
        }

        stage('Test') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    try {
                        sh 'npm test'
                    } finally {
                        // 테스트 완료 후 서버 종료
                        sh 'kill $(cat .pidfile) || true'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    echo 'Deploying application...'
                }
            }
        }
    }

    post {
        always {
            sh 'kill $(cat .pidfile) || true'
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
