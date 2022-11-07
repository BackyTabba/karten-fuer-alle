#https://medium.com/zenofai/how-to-build-a-node-js-and-mongodb-application-with-docker-containers-15e535baabf5
#Each instruction in this file creates a new layer
#Here we are getting our node as Base image
FROM node:latest
RUN mkdir -p /app
#setting working directory in the container
WORKDIR /app
#copying the package.json file(contains dependencies) from project source dir to container dir
COPY package.json /app
# installing the dependencies into the container
RUN npm install --legacy-peer-deps
#copying the source code of Application into the container dir
COPY . /app
#container exposed network port number
EXPOSE 3000
CMD ["npm", "run" , "normal"]