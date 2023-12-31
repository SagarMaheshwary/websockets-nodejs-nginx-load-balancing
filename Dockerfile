FROM node:18-alpine

WORKDIR /app

COPY package*.json /app

RUN npm i

COPY . /app

RUN npm run build

CMD [ "npm", "start" ]
