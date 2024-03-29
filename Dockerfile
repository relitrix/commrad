FROM node:20-alpine
LABEL author="relitrix"
LABEL org.opencontainers.image.source="https://github.com/relitrix/trackcombot"

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

USER node

COPY --chown=node:node . .

CMD [ "node", "." ]