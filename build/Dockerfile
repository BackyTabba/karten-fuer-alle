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