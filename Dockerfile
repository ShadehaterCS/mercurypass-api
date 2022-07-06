FROM node:16

WORKDIR /app

COPY . /app

EXPOSE 5555

RUN npm install

CMD npm run testStart