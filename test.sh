#!/bin/bash

# Debug docker version
#echo | docker-compose -v

# Stop any existing docker-composed containers
docker-compose down

# Rebuild the docker-composed containers
docker-compose up --build -d

# Run Tests
docker-compose run router npm test
docker-compose run runsservice npm test 
docker-compose run usersservice npm test

# Remove test containers
docker-compose down