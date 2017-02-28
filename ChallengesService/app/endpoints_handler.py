from dbmodels import db, Challenge, Challenge_Opponents
from flask import Response

import json

def endpointtest():
    return '# Rows in "Challenges" table: %d' % len(Challenge.query.all())

def handle_get_challenge(request, challengeid):
    response = Response()

    try:
        retrieved_challenge = Challenge.query.get(challengeid)
    except:
        response.status_code = 404
        return response    

    if retrieved_challenge is None:
        response.status_code = 404
    else:
        challenge_Dict = retrieved_challenge.as_Dict()

        response.status_code = 200
        response.headers['Content-Type'] = 'application/json'
        response.data = json.dumps(challenge_Dict)

    return response

def handle_delete_challange(request, challengeid)
    response = Response()

    try:
        retrieved_challenge = Challenge.query.get(challengeid)
    except:
        response.status_code = 404
        return response    

    if retrieved_challenge is None:
        response.status_code = 404
    else:
        db.session.delete(retrieved_challenge)
        db.session.commit()
        response.status_code = 200

    return response

def handle_add_new_challenge_by_user(request, userid)
    response = Response()
    challenge_info = request.get_json()

    

    return response