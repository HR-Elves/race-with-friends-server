from main import app
from flask_sqlalchemy import SQLAlchemy
import requests


db = SQLAlchemy(app)

class Challenge(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    run_id = db.Column(db.BigInteger)
    name = db.Column(db.Text)
    description = db.Column(db.Text)
    message = db.Column(db.Text)
    challenger_id = db.Column(db.Text, index=True)
    created = db.Column(db.Text)

    def as_Dict(self):
        selfAsDict = {
            'id' : self.id,
            'run_id': self.run_id,
            'name' : self.name,
            'description' : self.description,
            'message' : self.message,
            'challenger_id' : self.challenger_id,
            'created' : self.created,
            'opponents' : []
        }

        # Retrieve and populate opponents
        challenge_opponents = Challenge_Opponents.query.filter_by(challenge_id=self.id).all()
        if challenge_opponents is not None:
            for challenge in challenge_opponents:
                selfAsDict['opponents'].append(challenge.opponent_id)

        # Retrieve run information associated with the challenge
        response = requests.get('http://runsservice:80/runs/%s' %self.run_id)
        if response.status_code == 200:
            response_data = response.json()
            selfAsDict['challenger_name'] = response_data.get('name')
            selfAsDict['distanceTotal'] = response_data.get('length')
            selfAsDict['timeTotal'] = response_data.get('duration')

        return selfAsDict

class Challenge_Opponents(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    challenge_id = db.Column(db.BigInteger, db.ForeignKey('challenge.id'))
    opponent_id = db.Column(db.Text, index=True)
    issue_date = db.Column(db.Text, index=True)