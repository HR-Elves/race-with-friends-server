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

def handle_get_user_challenges(request, userid)
    response = Response()
    try:
        stored_challanges = Challenges.filter_by(challenger_id=userid).all()
    except:
        response.status_code = 404
        return response

   if stored_challanges is None or len(stored_challanges) == 0:
        response.status_code = 404
    else:
        response.status_code = 200
        responseContent = []        
        response.headers['Content-Type'] = 'application/json'
        
        for challenge in stored_challanges:
            responseContent.append(challenge.as_Dict())
        response.data = json.dumps(responseContent)

    return response

def handle_add_new_challenge_by_user(request, userid)
    response = Response()
    challenge_info = request.get_json()

    if challenge_info is None:
        response = Response()
        response.status_code = 400
        return response

    new_challenge = Challenge()

    new_challenge.run_id = challenge_info.get('runid')
    new_challenge.challenger_id = challenge_info.get('challengerid')
    new_challenge.name = challenge_info.get('name')
    new_challenge.description = challenge_info.get('description')
    new_challenge.created = challenge_info.get('created')

    db.session.add(new_challenge);
    db.session.flush();

    new_challenge_opponents = challenge_info.get('opponents')
        if new_challenge_opponents is not None:
            for opponent in new_challenge_opponents:
                new_opponent = Challenge_Opponents()
                new_opponent.challenge_id = new_challenge.id
                new_opponent.opponent_id = opponent
                issue_date = new_challenge.created

                db.session.add(new_opponent)              

    db.session.commit()
    responseContent = {'id': new_challenge.id}
    response = Response(json.dumps(responseContent))

    return response