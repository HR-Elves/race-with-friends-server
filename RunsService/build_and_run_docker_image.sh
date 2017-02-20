#!/bin/bash
# Setup verbose echo mode for bash
set -xv

# Global Variables
DOCKER_IMAGE_NAME="runwithfriends/runservice"
DOCKER_CONTAINER_NAME="runservice"
#DOCKER_EXPOSE_PORT="80"

# Stop any already-running containers that belongs to our image
docker stop $DOCKER_CONTAINER_NAME

# Sleep for 11 seconds to allow the running docker container's
# main process 
sleep 11

# Remove any "exited" docker containers
docker rm -v $(docker ps -a -q -f status=exited)

# Clean up any left over images
docker rmi $(docker images -a | grep "^<none>" | awk '{print $3}')

# Remove old version of the docker image
docker rmi $DOCKER_IMAGE_NAME

# Build the new version of the docker image
docker build -t $DOCKER_IMAGE_NAME .

# Run our newly built image in a new container named "$DOCKER_CONTAINER_NAME"
docker run --init --name $DOCKER_CONTAINER_NAME $DOCKER_IMAGE_NAME
