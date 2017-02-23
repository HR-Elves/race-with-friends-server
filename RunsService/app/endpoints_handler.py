from dbmodels import db, Run, DataPoint
from flask import Response

import json

def endpointtest():
  return '# Rows in "Runs" table: %d' % len(Run.query.all())
#####################
# Runs (with runid)
#####################

def handle_get_run(request, runid):
    response = Response()
    retrieved_run = Run.query.get(1)
    if len(retrieved_run) == 0:
      response.status_code = 404
    else:
      response.status_code = 200
      response.headers['Content-Type'] = 'application/json'
      # response.data = json.dumps()

    return response

#############################
# User's Runs (with userid)
#############################

def handle_post_user_runs(request, userid):
    data = request.get_json()
    new_run = Run()
    new_run.user_id = userid
    new_run.name = data['name']
    new_run.description = data['description']

    db.session.add(new_run)
    db.session.commit()

    responseContent = {'id': new_run.id}
    response = Response(json.dumps(responseContent))
    return response

def handle_get_user_runs(request, userid):
    response = Response()
    return "hello"