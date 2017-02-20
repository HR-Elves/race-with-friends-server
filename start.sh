#!/bin/bash

# Stop any existing docker-composed containers
docker-compose down

# Rebuild the docker-composed containers
docker-compose up --build