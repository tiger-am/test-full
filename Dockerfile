FROM node:10-alpine

#RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

RUN chown -R node:node /home/node/app

USER node
COPY package.json ./

RUN yarn

COPY --chown=node:node . .

EXPOSE 5000
EXPOSE 3000

CMD yarn
