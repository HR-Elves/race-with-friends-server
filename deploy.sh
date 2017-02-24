#!/bin/bash

if [ "$DEPLOYTOSTAGING" = "TRUE" ]; then

  # Tag the container images to use the namespace correspond to the team's Docker hub account
  docker tag racewithfriendsserver_router:latest hr52elves/router:latest
  docker tag racewithfriendsserver_runsservice:latest hr52elves/runsservice:latest
  docker tag racewithfriendsserver_usersservice:latest hr52elves/usersservice:latest

  # Login to Docker Hub
  docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS

  # Push the images to Docker Hub
  docker push hr52elves/router:latest
  docker push hr52elves/runsservice:latest
  docker push hr52elves/usersservice:latest

  echo "stopping running application"
  ssh $DEPLOY_USER@$DEPLOY_HOST 'cd /home/ubuntu/app/; docker-compose down;'
  ssh $DEPLOY_USER@$DEPLOY_HOST 'cd /home/ubuntu/app/; docker rm -v $(docker ps -a -q -f status=exited);'

  echo "pulling latest version of the code"
  ssh $DEPLOY_USER@$DEPLOY_HOST 'docker pull hr52elves/router:latest'
  ssh $DEPLOY_USER@$DEPLOY_HOST 'docker pull hr52elves/runsservice:latest'
  ssh $DEPLOY_USER@$DEPLOY_HOST 'docker pull hr52elves/usersservice:latest'    

  echo "starting the new version"
  # Copy over new deploy specific docker-compose file
  scp -r deploy-machine-docker-compose.yml $DEPLOY_USER@$DEPLOY_HOST:/home/ubuntu/app/docker-compose.yml

  # Copy over PostgreSQL testdb initialization configuration files to Deploy Server
  scp -r ./RunDB/init_testdb.sql $DEPLOY_USER@$DEPLOY_HOST:/home/ubuntu/app/RunDB/init_testdb.sql

  ssh $DEPLOY_USER@$DEPLOY_HOST 'cd /home/ubuntu/app/; docker-compose up -d'
  echo "success!"

  exit 0  
fi