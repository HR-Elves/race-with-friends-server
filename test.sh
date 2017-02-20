#!/bin/bash

# Debug docker version
echo | docker-compose -v

# Stop any existing docker-composed containers
docker-compose down

# Rebuild the docker-composed containers
docker-compose up --build -d

# Run Tests
docker-compose run web npm test
docker-compose run runservice npm test 

# Remove test containers
docker-compose down