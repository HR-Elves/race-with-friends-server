#!/bin/bash

docker-compose stop -t 1 $1
docker-compose build $1
docker-compose create $1
docker-compose start $1