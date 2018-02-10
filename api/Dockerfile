FROM node:6-alpine

MAINTAINER Liu Chong <mail@clojure.cn>

WORKDIR /opt/app

ADD . /opt/app

RUN apk --no-cache --virtual build-dependencies add \
    python make g++ && \
    npm install --verbose && \
    apk del build-dependencies

CMD npm start

EXPOSE 3000
