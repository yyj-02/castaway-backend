FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV HOST 0.0.0.0

EXPOSE 8080

EXPOSE 8000

EXPOSE 3000

CMD ["npm", "run", "start"]