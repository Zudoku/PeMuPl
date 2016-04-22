FROM nodesource/jessie:5.0.0

WORKDIR /
ADD ./ /pemupl
WORKDIR /pemupl/
RUN npm install

EXPOSE 3880

CMD ["node", "server.js"]