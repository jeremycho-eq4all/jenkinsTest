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
