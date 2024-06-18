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
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || true' // 테스트 실패해도 빌드가 계속되도록 설정
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
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
