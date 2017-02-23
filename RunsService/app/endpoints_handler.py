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
    retrieved_run = Run.query.get(runid)
    if retrieved_run is None:
        response.status_code = 404
    else:
        run_Dict = retrieved_run.as_Dict()

        response.status_code = 200
        response.headers['Content-Type'] = 'application/json'
        response.data = json.dumps(run_Dict)

    return response

def handle_delete_run(request, runid):
    response = Response()
    retrieved_run = Run.query.get(runid)
    if retrieved_run is None:
        response.status_code = 404
    else:
        # Add all datapoints belonging to this run to
        # queue to be deleted
        DataPoint.query.filter_by(run_id=runid)
        if run_datapoints is not None:
            for datapoint in run_datapoints:
                db.session.delete(datapoint)

        # Delete the run as well
        db.session.delete(retrieved_run)
        db.session.commit()
        response.status_code = 200

    return response

#############################
# User's Runs (with userid)
#############################

# Retrieve all runs made by the user from the database
def handle_get_user_runs(request, userid):
    response = Response()
    return "hello"

def handle_post_user_runs(request, userid):
    run_info = request.get_json()
    new_run = Run()
    new_run.user_id = userid
    new_run.name = run_info.get('name')
    new_run.description = run_info.get('description')
    new_run.length = run_info.get('length')
    new_run.duration = run_info.get('duration')
    new_run.created_on = run_info.get('created_on')

    # add new object and flush the session to obtain the run entry's id
    # hold off on a commit because we want the DB write to include both
    # run and it's data points
    db.session.add(new_run)
    db.session.flush()

    run_datapoints = run_info.get('data')
    if run_datapoints is not None:
        for datapoint in run_datapoints:
            new_datapoint = DataPoint()
            new_datapoint.latitude = datapoint.get('lat')
            new_datapoint.longitude = datapoint.get('long')
            new_datapoint.altitude = datapoint.get('alt')
            new_datapoint.accuracy = datapoint.get('accuracy')            
            new_datapoint.timestamp = datapoint.get('timestamp')
            new_datapoint.time_delta = datapoint.get('timeDelta')             
            new_datapoint.time_total = datapoint.get('timeTotal')
            new_datapoint.distance_delta = datapoint.get('distanceDelta')        
            new_datapoint.distance_total = datapoint.get('distanceTotal')
            new_datapoint.run_id = new_run.id

            db.session.add(new_datapoint)

    db.session.commit()

    responseContent = {'id': new_run.id}
    response = Response(json.dumps(responseContent))
    return response

def handle_get_user_runs(request, userid):
    response = Response()

    return "hello"

