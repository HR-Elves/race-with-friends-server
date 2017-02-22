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

from dbmodels import db, Run, DataPoint

@app.route("/")
def hello():
    dataDict = request.get_json()
    return "Hello World from Flask using Python 3.5 Yes!"

@app.route("/test", methods=['GET', 'POST'])
def test():
    return "Hello World, arrived to test!"

@app.route("/users/<userID>/runs")
def get_runs_belonging_to(userID):
    return "/Users/<userID>/runs endpoint with userID = " + userID

# Maintenance
@app.route("/status")
def status_check():
    return "RunsService is UP!"

# Debug
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

# Admin
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

