FROM node:8.7.0-alpine
RUN mkdir -p /srv/cp4aapi

WORKDIR /srv/cp4aapi

COPY api/package.json /srv/cp4aapi
COPY api/package-lock.json /srv/cp4aapi

RUN npm install

COPY ./api /srv/cp4aapi

ENV REACT_APP_BACA_URL=https://backend.159.122.214.124.nip.io/ca/rest/content/v1

CMD ["npm", "start"]

EXPOSE 9000
