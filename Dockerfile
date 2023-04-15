# Dockerfile

FROM node:18-alpine  

WORKDIR /app

ARG DB_URL

ENV DB_URL $DB_URL

COPY package*.json ./  

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
