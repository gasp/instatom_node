FROM node:8.4
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install pm2 -g -q
RUN npm install -q
COPY . .
CMD ["bash","pm2start.sh"]
