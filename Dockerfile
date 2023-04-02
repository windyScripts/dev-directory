# Dockerfile

FROM node:18-ubuntu  

WORKDIR /app

COPY package.json .  

RUN npm install

COPY . .

# RUN npm build

# EXPOSE 3000  

CMD ["npm", "run", "build"]

# CMD ["npm", "run", "dev"]  
