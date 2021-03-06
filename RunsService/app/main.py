from flask import Flask
from flask import request
from flask import Response

import datetime
import json

app = Flask(__name__)

# When running locally
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://<username>:<password>@localhost:5432/<databasename>'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://elves:elves@localhost:5432/rwfruns'

# When running within a container
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://elves:elves@runsdb:5432/rwfruns'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True      

from dbmodels import db, Run, DataPoint
from endpoints_handler import *


@app.route("/")
def root():
    dataDict = request.get_json()
    return "Reached UsersService!" + endpointtest()

#####################
# Runs (with runid)
#####################

@app.route("/runs/<runid>", methods=['GET', 'PUT', 'DELETE'])
def handle_run(runid):
    if (request.method == 'GET'):
        return handle_get_run(request, runid)
    elif (request.method == 'PUT'):
        return "Arrived @ /runs/<runid> PUT"
    elif (request.method == 'DELETE'):
        return handle_delete_run(request, runid)

#############################
# User's Runs (with userid)
#############################

@app.route("/users/<userid>/runs", methods=['GET', 'POST'])
def handle_user_runs(userid):
    if (request.method == 'GET'):
        return handle_get_user_runs(request, userid)
    elif (request.method == 'POST'):
        return handle_post_user_runs(request, userid)

###########################
# User's Run (with runid)
###########################

@app.route("/users/<userid>/runs/<runid>", methods=['GET', 'PUT', 'DELETE'])
def handle_user_run(userid, runid):
    if (request.method == 'GET'):
        return handle_get_user_run(request, userid, runid)
    elif (request.method == 'PUT'):
        return "Arrived @ /users/<userid>/runs/<runid> PUT"
    elif (request.method == 'DELETE'):
        return handle_delete_user_run(request, userid, runid)

##################
# Maintenance
##################

@app.route("/status")
def status_check():
    return "RunsService is UP!"

##################
# Debug
##################

@app.route("/reflect/string", methods=['GET', 'POST'])
def reflect_as_string():
    dataDict = request.get_json()
    return "HTTP POST JSON data: " + str(dataDict);

@app.route("/reflect/JSON", methods=['GET', 'POST'])
def reflect_as_JSON():
    dataDict = request.get_json()
    response = Response(json.dumps(dataDict))
    response.headers['Content-Type'] = 'application/json'
    return response;

##################
# Admin
##################
@app.route("/admin/database")
def admin_get_database_entry():
    displayValue = ''
    displayValue += '# Rows in "Runs" table: %d' % len(Run.query.all())
    displayValue += '# Rows in "DataPoints" table: %d' % len(DataPoint.query.all())    
    return displayValue

@app.route("/admin/database/wipe")
def admin_wipe_database():
    db.drop_all()
    return "Database Wiped"

@app.route("/admin/database/create")
def admin_create_database():
    db.create_all()
    return "Database Tables Created"

@app.route("/admin/database/wipe-and-create")
def admin_wipe_and_create_database():
    db.drop_all()
    db.create_all()
    return "Database Tables Wipe & Created"    

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=80)
    print("App run @ 80")

