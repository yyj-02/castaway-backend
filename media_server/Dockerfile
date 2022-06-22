FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 8080
ENV HOST 0.0.0.0

EXPOSE 8080

RUN npm run build

CMD [ "npm", "start" ]