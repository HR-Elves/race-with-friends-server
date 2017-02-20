# Base our Docker image based on 6.9 Boron NodeJS
# See https://hub.docker.com/_/node/ for other versions of NodeJS
FROM node:boron

# Creating directory within the Docker image where the app code lives
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

# Copy the package.json file into the docker container
# and run npm install to install all dependencies
COPY package.json /home/nodejs/app
RUN npm install

# Copy the application code from the current directory to the docker container
COPY . /home/nodejs/app

# Expose a port on the container
EXPOSE 8000

# Define the default 
CMD [ "npm", "start" ]