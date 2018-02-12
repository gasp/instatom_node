FROM node:8.4
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD package.json /usr/src/app/package.json
RUN npm install pm2 -g -q
RUN npm install -q

CMD ["bash","pm2start.sh"]
