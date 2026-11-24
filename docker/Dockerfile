# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.23.5
FROM node:${NODE_VERSION}
ARG GITHUB_REF
ADD . /var/www
RUN cd /var/www && npm install
RUN --mount=type=secret,id=sentry_auth_token,env=SENTRY_AUTH_TOKEN \
    cd /var/www && npm run build --ignore-scripts
CMD cd /var/www && npm run preview
#CMD cd /var/www && npm run dev
