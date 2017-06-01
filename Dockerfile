FROM node:8.0-slim

RUN apt-get -qq update && \
    apt-get -qq install git

RUN mkdir -p /node-mini-ci
WORKDIR /node-mini-ci

RUN mkdir -p /var/node_mini_ci_home
ENV NODE_CI_HOME /var/node_mini_ci_home

COPY ./ ./

CMD ["npm", "start"]