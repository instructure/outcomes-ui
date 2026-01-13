#! /usr/bin/env groovy
gergich_msg = ''

def verify_translations_up_to_date() {
  def exit_status = 0

  script {
    // Compare existing translations and generated translations
    def existing_translations_sha256 = sh (script: 'docker-compose run --rm ui sha256sum translations/en.json',
      returnStdout: true
    ).trim()

    sh 'docker-compose run --rm ui yarn run extract'

    def new_translations_sha256 = sh (script: 'docker-compose run --rm ui sha256sum translations/en.json',
      returnStdout: true
    ).trim()

    if (existing_translations_sha256 != new_translations_sha256) {
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
  }

  options {
    ansiColor("xterm")
    timeout(time: 20, unit: 'MINUTES')
  }

  stages {
    stage('Build UI') {
      steps {
        script {
          sh 'docker-compose build --pull ui'
        }
      }
    }

    stage('Static UI Analysis') {
      steps {
        script {
          echo 'Verifying Lockfile up to date'
          sh 'docker-compose run --rm ui yarn --ignore-scripts --frozen-lockfile'

          echo 'Running ESLint'
          sh '''#!/usr/bin/env bash
          set -o pipefail
          docker-compose run --rm ui yarn run lint \
            | docker-compose run --rm gergich capture eslint -
          '''

          echo 'Verifying Translations'
          def translations_status = verify_translations_up_to_date()
          sh "exit $translations_status"
        }
      }
    }

    stage ('Snyk') {
      when { environment name: "GERRIT_EVENT_TYPE", value: "change-merged" }
      environment {
        SNYK_TOKEN = credentials('SNYK_TOKEN_CANVAS_LMS_ORG')
        ORG = "canvas-lms"
        PROJECT_NAME = "outcomes-ui"
        PROJECT_TEAM = "dev-team=engage"
      }
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
          script {
            sh '''
              docker-compose run -e "SNYK_TOKEN=${SNYK_TOKEN}" --rm ui bash -c "
                SNYK_ORG=${ORG}
                SNYK_PROJECT_NAME=${PROJECT_NAME}
                SNYK_PROJECT_TAGS=${PROJECT_TEAM}
                yarn run snyk-test;
                yarn run snyk-monitor
              "
            '''
          }
        }
      }
    }

    stage('UI Tests') {
      steps {
        sh 'docker-compose run --name outcomes_ui ui yarn test:jest-rtl'
      }
      post {
        always {
          sh 'docker cp outcomes_ui:/usr/src/app/coverage ./ui_coverage'
          archiveArtifacts 'ui_coverage/**'
        }
        success {
          script {
            def ui_coverage = sh (script: 'grep -B 1 "Lines" ui_coverage/lcov-report/index.html | head -1 | grep -Eo "[0-9]+\\.[0-9]+\\%"',
              returnStdout: true
            ).trim()
            def path_to_coverage = "$env.BUILD_URL" + 'artifact/ui_coverage/lcov-report/index.html'
            gergich_msg += ":js: ${ui_coverage} <$path_to_coverage>"
          }
        }
      }
    }

    stage('Validate Storybook Stories') {
      steps {
        sh 'docker-compose run --rm ui yarn test-storybook'
      }
    }

    stage('Post Merge') {
      when { environment name: "GERRIT_EVENT_TYPE", value: "change-merged" }
      environment { SONAR_TOKEN = credentials('OUTCOMES_UI_SONAR_TOKEN') }
      steps {
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
