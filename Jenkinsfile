// CI/CD pipeline for the Express frontend
pipeline {
    agent any

    // Runs automatically when GitHub sends a push webhook
    triggers {
        githubPush()
    }

    // Settings used by the stages below (no secrets are stored in this file)
    environment {
        APP_DIR    = '/opt/apps/express-frontend'
        SERVICE    = 'express-frontend'
        HEALTH_URL = 'http://localhost:3000/'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                // Pull the latest code from the Git repository into the Jenkins workspace
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                // Update the live copy of the app, install its dependencies, restart the service
                sh '''
                    sudo -u ubuntu git -C "$APP_DIR" pull --ff-only
                    sudo -u ubuntu npm --prefix "$APP_DIR" install --omit=dev
                    sudo systemctl restart "$SERVICE"
                '''
            }
        }

        stage('Health check') {
            steps {
                sh '''
                    sleep 5
                    curl --fail --silent --show-error --output /dev/null "$HEALTH_URL"
                    echo "Frontend is responding."
                '''
            }
        }
    }

    post {
        success { echo 'Express frontend deployed successfully.' }
        failure { echo 'Pipeline failed. The running application was not changed by a failed test.' }
    }
}
