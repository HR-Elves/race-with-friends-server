from flask import Flask
from flask import request

app = Flask(__name__)


# When running locally
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://<username>:<password>@localhost:5432/<databasename>'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://elves:elves@localhost:5432/rwfruns'

# When running within a container
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://elves:elves@runsdb:5432/rwfruns'

from dbmodels import Dummy

@app.route("/", methods=['GET', 'POST'])
def hello():
    dataDict = request.get_json()
    return "Hello World from Flask using Python 3.5 Yes!" + dataDict['userid']

@app.route("/test", methods=['GET', 'POST'])
def test():
    users = Dummy.query.all()
    return "Hello World, arrived to test!" + users;

@app.route("/users/<userID>/runs")
def get_runs_belonging_to(userID):
    return "/Users/<userID>/runs endpoint with userID = " + userID

# DEVELOPMENT ONLY
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

