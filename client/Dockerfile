FROM node:8.7.0-alpine
RUN mkdir -p /app/cp4aapp

WORKDIR /app/cp4aapp

COPY package.json
COPY package-lock.json

RUN npm install

COPY . /app/cp4aapp

CMD ["npm", "start"]
