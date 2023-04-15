# Dockerfile

FROM node:18-alpine  

ENV DB_HOST: pg
ENV DB_PORT: 5432
ENV DB_USER: postgres
ENV DB_NAME: dev-directory
ENV DB_PASSWORD: password
ENV AUTH_SECRET: secret
ENV DATABASE_URL: postgres://postgres:password@localhost:5432/dev-directory

WORKDIR /app

COPY package*.json ./  

RUN npm install

COPY . .

EXPOSE 3000

RUN env

CMD ["npm", "run", "dev"]
