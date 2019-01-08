FROM node:11.1.0
ENV PORT=8080 FILEPATH=/etc/proxy/proxy.yaml
WORKDIR /app
COPY package*.json /app
RUN yarn
COPY . /app
EXPOSE 8080
CMD ["yarn", "start"]