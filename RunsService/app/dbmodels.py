from main import app
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)

class Run(db.Model):
  id = db.Column(db.BigInteger, primary_key=True)
  name = db.Column(db.Text)
  description = db.Column(db.Text)
  length = db.Column(db.Float)
  duration = db.Column(db.Float)
  created_on = db.Column(db.DateTime)
  user_id = db.Column(db.Text)
  data_points = db.relationship('DataPoint', backref='run', lazy='dynamic')

  def __str__(self):
      displayString = ''
      displayString += 'db_id: %d \n' % self.id
      displayString += 'name: %s \n' % self.name
      displayString += 'description: %s \n' % self.description

      return displayString

class DataPoint(db.Model):
  id = db.Column(db.BigInteger, primary_key=True)
  latitude = db.Column(db.Float)
  longitude = db.Column(db.Float)
  altitude = db.Column(db.Float)
  timestamp = db.Column(db.DateTime)
  time_delta = db.Column(db.Float)
  time_total = db.Column(db.Float)
  dist_delta = db.Column(db.Float)
  dist_total = db.Column(db.Float)
  run_id = db.Column(db.BigInteger, db.ForeignKey('run.id'))
