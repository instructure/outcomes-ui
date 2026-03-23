#!/usr/bin/env bash

set -ex

export GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -i /usr/src/sshkeyfile -l '$SSH_USERNAME'"

git config --global user.name "Jenkins"
git config --global user.email "svc.cloudjenkins@instructure.com"

# Authenticate with the public npm registry
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> ~/.npmrc

VERSION=$(node -p "require('./package.json').version")

git log -1 # verify HEAD before proceeding

if npm view "@instructure/outcomes-ui@${VERSION}" version 2>/dev/null; then
  echo "Version ${VERSION} already published — skipping npm publish"
else
  rm -rf es lib
  npm publish
fi

if git ls-remote --tags origin "outcomes-ui-${VERSION}" | grep -q "outcomes-ui-${VERSION}"; then
  echo "Tag outcomes-ui-${VERSION} already exists — skipping git tag"
else
  git tag "outcomes-ui-${VERSION}"
  git push origin "outcomes-ui-${VERSION}"
fi
