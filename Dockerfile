FROM node:18-alpine  

WORKDIR /app

ARG DB_PASSWORD
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_NAMEd


ENV DB_PASSWORD $DB_PASSWORD
ENV DB_HOST $DB_HOST
ENV DB_PORT $DB_PORT
ENV DB_USER $DB_USER
ENV DB_NAMEd $DB_NAMEd

COPY package*.json ./  

RUN npm install

COPY . .

RUN npm run build

RUN npm run sequelize-cli db:migrate

EXPOSE 3000

CMD ["npm", "run", "dev"]
