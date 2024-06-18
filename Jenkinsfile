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
                    sh 'apt-get update && apt-get install -y lsof'
                    sh 'npm install'
                    sh 'npm audit fix --force || true' 
                }
            }
        }

        stage('Start Server') {
            steps {
                script {
                     // 기존 서버가 있다면 종료
                    sh 'lsof -i :3010 | grep LISTEN | awk \'{print $2}\' | xargs kill -9 || true'
                    // Node.js 서버를 백그라운드에서 시작하고 PID를 저장
                    sh 'nohup npm start & echo $! > .pidfile'
                }
            }
        }
        
        stage('Test') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    sh 'npm test || true' // 테스트 실패해도 빌드가 계속되도록 설정
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
