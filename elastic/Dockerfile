FROM node:18.20-alpine
COPY app-search-reference-ui-react-master /

WORKDIR /app-search-reference-ui-react-master

RUN yarnpkg install

ENTRYPOINT yarnpkg start
