from flask import Flask
from flask import request
from flask import Response

import datetime
import json

app = Flask(__name__)

# When running locally
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://<username>:<password>@localhost:5432/<databasename>'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://elves:elves@localhost:5432/rwfruns' 

# When running within a container
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://elves:elves@runsdb:5432/rwfruns'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True      

from dbmodels import db, Challenge, Challenge_Opponents
from endpoints_handler import *


@app.route("/")
def root():
    dataDict = request.get_json()
    return "Reached Challenges Service!" + endpointtest()


################################
# Challenges (with challengeid)
################################

@app.route("/challenges/<challengeid>", methods=['GET', 'DELETE'])
def handle_challenges(challengeid):
    if (request.method == 'GET'):
        return handle_get_challenge(request, challengeid)
    elif (request.method == 'DELETE'):
        return handle_delete_challange(request, challengeid)

#######################################################
# Retriving All Challenges where a User is an opponent
#######################################################

@app.route("/challenges", methods=['GET'])
def handle_challanges_opponent_lookup():
    if (request.method == 'GET'):
        return handle_get_challenge_by_opponent(request)

#################################################
# Challenge's Opponents (adding and retrieving)
#################################################

@app.route("/challenges/<challengeid>/opponents", methods=['GET', 'POST', 'DELETE'])
def handle_challenge_opponents_operations(challengeid):
    if (request.method == 'GET'):
        return handle_get_challenge_opponents(request, challengeid)
    elif (request.method == 'POST'):
        return handle_add_challenge_opponents(request, challengeid)
    elif (request.method == 'DELETE'):
        return handle_delete_challenge_opponents(request, challengeid)        

@app.route("/challenges/<challengeid>/opponents/<opponentid>", methods=['POST', 'DELETE'])
def handle_challange_opponent_operations(challengeid, opponentid):
    if (request.method == 'DELETE'):
        return handle_remove_challenge_opponent(request, challengeid, opponentid)

##################################
# User's Challenges (with userid)
##################################

@app.route("/users/<userid>/challenges", methods=['GET', 'POST', 'DELETE'])
def handle_user_challenges(userid):
    if (request.method == 'GET'):
        return handle_get_user_challenges(request, userid)
    elif (request.method == 'POST'):
        return handle_add_new_challenge_by_user(request, userid)

##################
# Maintenance
##################

@app.route("/status")
def status_check():
    return "Challenge Service is UP!"

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
    displayValue += '# Rows in "Challenge" table: %d' % len(Challenge.query.all())
    displayValue += '# Rows in "Challenge_Opponents" table: %d' % len(Challenge_Opponents.query.all())    
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

