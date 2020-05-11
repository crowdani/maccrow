FROM node:8.7.0-alpine
RUN mkdir -p /srv/cp4aapi

WORKDIR /srv/cp4aapi

COPY package.json
COPY package-lock.json

RUN npm install

COPY . /srv/cp4aapi

CMD ["npm", "run", "dev"]
