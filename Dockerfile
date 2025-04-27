FROM instructure/node:20

ENV APP_HOME=/usr/src/app/
ENV YARN_CACHE=/home/docker/.cache/yarn

RUN mkdir -p $APP_HOME/coverage $APP_HOME/node_modules $YARN_CACHE

COPY --chown=docker:docker . $APP_HOME

RUN yarn config set prefer-offline true \
  && yarn config set no-progress true \
  && yarn config set cache-folder $YARN_CACHE

USER root
RUN apt-get -q update && apt-get -yq install jq git openssh-client && apt-get clean
USER docker

EXPOSE 8080
