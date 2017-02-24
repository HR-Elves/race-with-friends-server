from main import app
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)

class Run(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.Text)
    description = db.Column(db.Text)
    length = db.Column(db.Float)
    duration = db.Column(db.BigInteger)
    created_on = db.Column(db.Text)
    user_id = db.Column(db.Text, index=True)
    data_points = db.relationship('DataPoint', backref='run', lazy='dynamic')

    def __str__(self):
        displayString = ''
        displayString += 'db_id: %d \n' % self.id
        displayString += 'name: %s \n' % self.name
        displayString += 'description: %s \n' % self.description

        return displayString

    def as_Dict(self):
        selfAsDict = {
            'id' : self.id,
            'user_id': self.user_id,
            'name' : self.name,
            'description' : self.description,
            'length' : self.length,
            'duration' : self.duration,
            'created_on' : self.created_on,
            'data' : []
        }
        
        run_datapoints = DataPoint.query.filter_by(run_id=self.id)
        if run_datapoints is not None:
            for datapoint in run_datapoints:
                selfAsDict['data'].append(datapoint.as_Dict())

        return selfAsDict


class DataPoint(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    altitude = db.Column(db.Float)
    accuracy = db.Column(db.Float)
    timestamp = db.Column(db.Text)
    time_delta = db.Column(db.Integer)
    time_total = db.Column(db.BigInteger)
    distance_delta = db.Column(db.Float)
    distance_total = db.Column(db.Float)
    run_id = db.Column(db.BigInteger, db.ForeignKey('run.id'))

    def as_Dict(self):
        selfAsDict = {
          'lat' : self.latitude,
          'long' : self.longitude,
          'alt' : self.altitude,
          'accuracy' : self.accuracy,
          'timestamp' : self.timestamp,
          'timeDelta' : self.time_delta,      
          'timeTotal' : self.time_total,
          'distanceDelta' : self.distance_delta,
          'distanceTotal' : self.distance_total,
        }
        return selfAsDict



