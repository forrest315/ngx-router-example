FROM node:4-onbuild

MAINTAINER Liu Chong <mail@clojure.cn>

WORKDIR /opt/app

ADD . /opt/app

RUN npm install

CMD npm start

EXPOSE 3000
