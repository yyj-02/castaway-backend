FROM node:latest

WORKDIR /app

RUN apt-get update && \
  apt-get install -y build-essential python3-pip

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 8080
ENV HOST 0.0.0.0

EXPOSE 8080
EXPOSE 8080/udp

RUN npm run build

CMD [ "npm", "start" ]