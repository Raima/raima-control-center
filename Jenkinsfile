node('linux') {
    def image = null

    stage('Checkout') {
        checkout scm
    }

    stage('Create Docker Image') {
        image = docker.build("ubuntu-22.04-npm", "docker/ubuntu-22.04-npm")
    }

    stage('Build') {
        image.inside {
            sh 'npm upgrade'
            sh 'npm run build'
            sh 'mv dist admin-gui'
            sh 'tar cf admin-gui.tar admin-gui'
        }
    }

    stage('Archive Artifacts') {
        archiveArtifacts artifacts: 'admin-gui.tar', allowEmptyArchive: false
    }

    stage('Cleanup') {
        image.inside {
            sh 'rm -r admin-gui'
        }
    }
}
