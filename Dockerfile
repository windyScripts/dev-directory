# Dockerfile

FROM node:18-alpine  

WORKDIR /app

ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_NAME
ARG DB_PASSWORD

ENV DB_HOST $DB_HOST
ENV DB_PORT $DB_PORT
ENV DB_USER $DB_USER
ENV DB_NAME $DB_NAME
ENV DB_PASSWORD $DB_PASSWORD


COPY package*.json ./  

RUN npm install

COPY . .

EXPOSE 3000

RUN env

CMD ["npm", "run", "dev"]
