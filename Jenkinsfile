#! /usr/bin/env groovy
gergich_msg = ''

def verify_lockfile_up_to_date() {
  def exit_status = 0

  script {
    // Compare existing yarn.lock and generated yarn.lock
    def existing_yarn_lock_sha256 = sh (script: 'docker-compose run --rm karma sha256sum yarn.lock',
      returnStdout: true
    ).trim()

    sh 'docker-compose run --rm karma yarn --ignore-scripts'

    def new_yarn_lock_sha256 = sh (script: 'docker-compose run --rm karma sha256sum yarn.lock',
      returnStdout: true
    ).trim()

    if (existing_yarn_lock_sha256 != new_yarn_lock_sha256) {
      echo '    The Yarn lock file appears to be out of date!'
      echo '    Please run \"docker-compose run --rm ui yarn\",'
      echo '    and add any lock file changes to your commit.'
      exit_status = 1
    }
  }
  return exit_status
}

def verify_translations_up_to_date() {
  def exit_status = 0

  script {
    // Compare existing yarn.lock and generated yarn.lock
    def existing_yarn_lock_sha256 = sh (script: 'docker-compose run --rm karma sha256sum translations/en.json',
      returnStdout: true
    ).trim()

    sh 'docker-compose run --rm karma yarn run extract'

    def new_yarn_lock_sha256 = sh (script: 'docker-compose run --rm karma sha256sum translations/en.json',
      returnStdout: true
    ).trim()

    if (existing_yarn_lock_sha256 != new_yarn_lock_sha256) {
      echo '    The translations/en.json catalog appears to be out of date!'
      echo '    Please run \"docker-compose run --rm ui yarn run extract\",'
      echo '    and add any translation file changes to your commit.'
      exit_status = 1
    }
  }
  return exit_status
}

pipeline {
  agent { label 'docker' }
  environment {
      COMPOSE_PROJECT_NAME = 'outcomes-ui'
      COMPOSE_FILE = 'docker-compose.test.yml'
      SNYK_TOKEN = credentials('SNYK_TOKEN')
  }

  options {
    ansiColor("xterm")
    timeout(time: 20, unit: 'MINUTES')
  }

  stages {
    stage('Build UI') {
      steps {
        script {
          sh 'docker-compose build --pull karma'

          def lockfile_status = verify_lockfile_up_to_date()
          sh "exit $lockfile_status"
        }
      }
    }

    stage('Static UI Analysis') {
      steps {
        script {
          echo 'Running ESLint'
          sh '''#!/usr/bin/env bash
          set -o pipefail
          docker-compose run --rm karma yarn run lint \
            | docker-compose run --rm gergich capture eslint -
          '''

          echo 'Verifying Translations'
          def translations_status = verify_translations_up_to_date()
          sh "exit $translations_status"

          if (env.GERRIT_EVENT_TYPE == "change-merged") {
            echo 'Scanning modules for security vulnerabilities'
            try {
              sh 'docker-compose run -e "SNYK_TOKEN=${SNYK_TOKEN}" --rm karma bash -c "yarn run snyk-test; yarn run snyk-monitor"'
            } catch (err) {
              echo "Snyk module scan exited with non-zero status code! " + err.toString()
            }
          }
        }
      }
    }

    stage('UI Tests') {
      steps {
        sh 'docker-compose run --name outcomes_ui karma yarn test:headless -- --single-run --no-auto-watch --coverage'
      }
      post {
        always {
          sh 'docker cp outcomes_ui:/usr/src/app/coverage/ui ./ui_coverage'
          archiveArtifacts 'ui_coverage/**'
        }
        success {
          script {
            def ui_coverage = sh (script: 'grep -B 1 "Lines" ui_coverage/index.html | head -1 | grep -Eo "[0-9]+\\.[0-9]+\\%"',
              returnStdout: true
            ).trim()
            gergich_msg += ":js: <$env.BUILD_URL/UI_20Coverage_20Report/|${ui_coverage}>"

            if (env.GERRIT_EVENT_TYPE == "change-merged") {
              // publish html
              publishHTML target: [
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'ui_coverage',
                reportFiles: 'index.html',
                reportName: 'UI Coverage Report'
              ]
              // publish coverage to code-coverage.inseng.net/outcomes-ui/coverage
              uploadCoverage([
                uploadSource: '/ui_coverage',
                uploadDest: 'outcomes-ui/coverage'
              ])
            }
          }
        }
      }
    }
  }

  post {
    always {
      sh "docker-compose run --rm gergich message \"${gergich_msg}\""
      sh 'docker-compose run --rm gergich status'
      sh 'docker-compose run --rm gergich publish'
    }
    cleanup {
      sh 'if [ -d "ui_coverage" ]; then rm -rf "ui_coverage"; fi'
      sh 'docker-compose down --volumes --remove-orphans --rmi all'
    }
  }
}
