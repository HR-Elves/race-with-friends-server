from flask_testing import TestCase
from main import app, db, Challenge, Challenge_Opponents
import unittest
import json

class ChallengeServiceTestCase(TestCase):

    def create_app(self):
        return app

    def setUp(self):
        app.testing = True        
        self.app = app.test_client()

        app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://elves:elves@runsdb:5432/testdb'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True        
        app.config['TESTING'] = True
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_0030_handle_get_challenge_with_invalid_challengeid(self):
        print('======================================================')
        print('=== Endpoint Testing                                ==')        
        print('======================================================')    
        print('+ Test: GET to /challenges/<challengeid> with invalid challengeid')

        response = self.app.get('/challenges/ID_that_does_not_exist')
        print(' - Trying to retrieve non-existent run from /challenges/<challengeid>')
        print(' - Expect server to return HTTP Status Code of 404')
        assert response.status_code == 404

    def test_0040_handle_get_challenge_with_valid_challengeid(self):
        print('+ Test: GET to /challenges/<challengeid> with valid challengeid')

        # POST to add run to DB
        response = self.app.post('/users/dummyid/challenges', data='{"name":"some challenge"}', content_type='application/json')
        returned_challenge_id = json.loads(response.data.decode("utf-8")).get('id')

        response = self.app.get('/challenges/%d' %returned_challenge_id)
        response_data = json.loads(response.data.decode("utf-8"))

        print(" - Expect server to return previously posted run")
        assert response_data.get('name') == 'some challenge'

    def test_0050_handle_delete_challenge_with_invalid_challengeid(self):
        print('+ Test: DELETE to /challenges/<challengeid> with invalid challengeid')

        response = self.app.post('/users/dummyid/challenges', data='{"name":"some challenge"}', content_type='application/json')
        returned_challenge_id = json.loads(response.data.decode("utf-8")).get('id')

        response_to_delete = self.app.delete('/challenges/some_invalid_challengeid')
        print(" - Expect server to return status code 404")
        assert response_to_delete.status_code == 404


    def test_0051_handle_delete_challenge_with_valid_challengeid(self):
        print('+ Test: DELETE to /challenges/<challengeid> with valid challengeid')

        response = self.app.post('/users/dummyid/challenges', data='{"name":"some challenge"}', content_type='application/json')
        returned_challenge_id = json.loads(response.data.decode("utf-8")).get('id')

        response = self.app.get('/challenges/%d' %returned_challenge_id)
        response_data = json.loads(response.data.decode("utf-8"))
        print(" - Expect server to return previously saved challenge")
        assert response_data.get('name') == 'some challenge'

        response_to_delete = self.app.delete('/challenges/%d' %returned_challenge_id)
        print(" - Expect server to be able to delete a previously saved challenge")        
        print(" - Expect server to return status code 200")
        assert response_to_delete.status_code == 200

        response = self.app.get('/challenges/%d' %returned_challenge_id)
        print(" - Expect server to return 404 for a previously deleted challenge")
        assert response.status_code == 404

    def test_0060_handle_retriving_challenge_with_a_user_as_an_opponent(self):
        print('+ Test: GET to /challenges?opponent=<opponent_id> with valid opponent_id')
        response = self.app.post('/users/joe/challenges', data='{"name":"some challenge","opponents":["cow","bird"]}', content_type='application/json')

        response = self.app.get('/challenges?opponent=cow')
        print(" - Expect server to be able to retrieve challenges by opponent")
        assert response.status_code == 200

        response_data = json.loads(response.data.decode("utf-8"))
        print(" - Expect server to return the correct challenge previously saved")
        assert response_data[0].get('name') == "some challenge"

    def test_0061_handle_retriving_challenge_with_a_user_as_an_opponent(self):
        print('+ Test: GET to /challenges?opponent=<opponent_id> with non-existent opponent_id')
        response = self.app.post('/users/joe/challenges', data='{"name":"some challenge","opponents":["cow","bird"]}', content_type='application/json')

        response = self.app.get('/challenges?opponent=some_non_existent_id')
        print(" - Expect server to be return status code of 200")
        assert response.status_code == 200

        response_data = json.loads(response.data.decode("utf-8"))
        print(" - Expect server to return the an empty array")
        assert response_data == []

    def test_0070_handle_getting_opponents_to_challenge(self):
        print('+ Test: GET to /challenges/<challengeid>/opponents')

        # Add a new challenge
        response = self.app.post('/users/joe/challenges', data='{"name":"some challenge"}', content_type='application/json')
        returned_challenge_id = json.loads(response.data.decode("utf-8")).get('id')

        print(' - Expect to get a 200 OK when POST to opponents')
        response = self.app.post('/challenges/1/opponents', data='["cow", "rabbit"]', content_type='application/json')        
        assert response.status_code == 200, "Expect 200 OK: Got: %d" %response.status_code

        # Retrive the challenge with newly added opponents
        response = self.app.get('/challenges/1')
        response_data = json.loads(response.data.decode("utf-8"))
        print(' - Expect to get two opponents from the retrieved challenge')
        assert response_data.get('opponents') == ["cow", "rabbit"]

    def test_0080_handle_adding_opponents_to_challenge(self):
        print('+ Test: POST to /challenges/<challengeid>/opponents')

        # Add a new challenge
        response = self.app.post('/users/joe/challenges', data='{"name":"some challenge"}', content_type='application/json')
        returned_challenge_id = json.loads(response.data.decode("utf-8")).get('id')

        print(' - Expect to get a 200 OK when POST to opponents')
        response = self.app.post('/challenges/1/opponents', data='["cow", "rabbit"]', content_type='application/json')        
        assert response.status_code == 200, "Expect 200 OK: Got: %d" %response.status_code

        # Retrive the challenge with newly added opponents
        response = self.app.get('/challenges/1')
        response_data = json.loads(response.data.decode("utf-8"))
        print(' - Expect to get two opponents from the retrieved challenge')
        assert len(response_data.get('opponents')) == 2


    def test_0090_handle_post_user_challenges_with_valid_data(self):
        response = self.app.post('/users/joe/challenges', data='{"name":"challenge1"}', content_type='application/json')
        print('+ Test: POST to /users/<userid>/challenges')

        print(' - Expect to be able to post to /users/<userid>/challenges.')
        assert response.status_code == 200, "Expect 200 OK: Got: %d" %response.status_code

        print(' - Expect database to have one "run" entry')
        assert len(Challenge.query.all()) == 1

        print(' - Expect server to return an id of 1 in response body')
        returned_challenge_id = json.loads(response.data.decode("utf-8")).get('id')
        assert returned_challenge_id == 1

    def test_0100_handle_get_user_challenges_with_valid_userid(self):
        response = self.app.post('/users/joe/challenges', data='{"name":"challenge1"}', content_type='application/json')
        response = self.app.post('/users/joe/challenges', data='{"name":"challenge2"}', content_type='application/json')        
        print('+ Test: GET to /users/<userid>/challenges')

        print(' - Expect to be able to GET to /users/<userid>/challenges with valid userid')
        assert response.status_code == 200, "Expect 200 OK: Got: %d" %response.status_code

        print(' - Expect database to have two "challenge" entry')
        assert len(Challenge.query.all()) == 2

        print(' - Expect server to two challenges response body')
        response = self.app.get('/users/joe/challenges')
        returned_challenge_data = json.loads(response.data.decode("utf-8"))
        assert len(returned_challenge_data) == 2

    def test_0110_handle_get_user_challenges_with_non_existent_userid(self):
        response = self.app.post('/users/joe/challenges', data='{"name":"challenge1"}', content_type='application/json')
        response = self.app.post('/users/joe/challenges', data='{"name":"challenge2"}', content_type='application/json')        
        print('+ Test: GET to /users/<userid>/challenges with non-existent userid')

        print(' - Expect to be able to GET to /users/<userid>/challenges.')
        assert response.status_code == 200, "Expect 200 OK: Got: %d" %response.status_code

        print(' - Expect database to have two "challenge" entry')
        assert len(Challenge.query.all()) == 2

        print(' - Expect server to zero challenges response body when ')
        response = self.app.get('/users/non_existent_user/challenges')
        returned_challenge_data = json.loads(response.data.decode("utf-8"))
        assert len(returned_challenge_data) == 0


if __name__ == '__main__':
    unittest.main()