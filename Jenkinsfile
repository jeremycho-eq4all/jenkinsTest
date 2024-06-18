pipeline {
    agent any

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                // Git 저장소에서 소스를 체크아웃합니다.
                git 'https://github.com/jeremycho-eq4all/jenkinsTest.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Node.js 패키지를 설치합니다.
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                // 테스트를 실행합니다.
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                // 빌드 과정 (필요한 경우, 이 예제에서는 단순히 실행됩니다)
                sh 'npm run build' // build 스크립트가 있는 경우
            }
        }

        stage('Deploy') {
            steps {
                // 배포 과정 (이 예제에서는 생략, 실제 배포 스크립트나 명령어를 추가)
                echo 'Deploying application...'
            }
        }
    }

    post {
        always {
            junit 'test-results.xml'
        }
        success {
            mail to: 'a@example.com,b@example.com',
                 subject: "Success: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                 body: "Good job! The build was successful."
        }
        failure {
            mail to: 'a@example.com,b@example.com',
                 subject: "Failed: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                 body: "Oops! The build failed. Please check the logs."
        }
    }
}
