from flask_testing import TestCase
from main import app, db, Run, DataPoint
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

    # def test_0010_root_endpoint_exist(self):
    #     print('\n')
    #     print('======================================================')
    #     print('=== Endpoint Testing                                ==')        
    #     print('======================================================')

    #     response = self.client.get("/")
    #     assert response.status_code == 200, "Root Endpoint Should Exist"

    # def test_0030_handle_get_run_with_non_existent_runid(self):
    #     print('+ Test: GET to /runs/<runid> with invalid runid')

    #     response = self.app.get('/runs/ID_that_does_not_exist')
    #     print(' - Trying to retrieve non-existent run from /runs/<runid>')
    #     print(' - Expect server to return HTTP Status Code of 404')
    #     assert response.status_code == 404

    # def test_0040_handle_get_run(self):
    #     print('+ Test: GET to /runs/<runid> with valid runid')

    #     # POST to add run to DB
    #     response = self.app.post('/users/dummyid/runs', data='{"name":"joe"}', content_type='application/json')
    #     returned_run_id = json.loads(response.data.decode("utf-8")).get('id')

    #     response = self.app.get('/runs/%d' %returned_run_id)
    #     response_data = json.loads(response.data.decode("utf-8"))

    #     print(" - Expect server to return previously posted run")
    #     assert response_data.get('name') == 'joe'

    # def test_0050_handle_delete_run(self):
    #     print('+ Test: DELETE to /runs/<runid> with valid runid')

    #     # POST to add run to DB
    #     response = self.app.post('/users/dummyid/runs', data='{"name":"joe"}', content_type='application/json')
    #     returned_run_id = json.loads(response.data.decode("utf-8")).get('id')

    #     # GET to retrieve newly added run
    #     response = self.app.get('/runs/%d' %returned_run_id)
    #     response_data = json.loads(response.data.decode("utf-8"))

    #     print(" - Expect server to return previously posted run")
    #     assert response_data.get('name') == 'joe'

    #     print (" - Deleting Run")
    #     response = self.app.delete('/runs/%d' %returned_run_id)
    #     print (" - Expect server to return HTTP Status Code of 200 on DELETE")

    #     response = self.app.get('/runs/%d' %returned_run_id)
    #     print(" - Expect server to be unable to locate deleted run and return 404")
    #     assert response.status_code == 404

    # def test_0060_handle_get_user_runs_with_non_existent_user(self):
    #     print('+ Test: GET to /users/<userid>/runs with non-existent user')
    #     response = self.app.get('/users/non_existent_user/runs')

    #     print(' - Expect server to unable to location user and return 404')
    #     assert response.status_code == 404, 'actual status code:%d and data %s' % (response.status_code, response.data)

    # def test_0070_handle_get_user_runs(self):
    #     print('+ Test: GET to /users/<userid>/runs with valid user')

    #     # POST to /users/joe/runs to pre-populate the database
    #     response = self.app.post('/users/joe/runs', data='{"name":"joe run 1"}', content_type='application/json')
    #     response = self.app.post('/users/joe/runs', data='{"name":"joe run 2"}', content_type='application/json')

    #     response = self.app.get('/users/joe/runs')
    #     response_data = json.loads(response.data.decode("utf-8"))        
    #     print(' - Expect server to return two previously returned runs')
    #     assert len(response_data) == 2

    # def test_0080_handle_post_user_runs_with_no_data(self):
    #     response = self.app.post('/users/dummyid/runs', content_type='application/json')
    #     print('+ Test: POST to /users/<userid>/runs with no data')    
    #     print(' - Posting to /users/<userid>/runs with no data')
    #     print(' - Expect server to return HTTP Status Code of 400')
    #     assert response.status_code == 400

    # def test_0090_handle_post_user_runs(self):
    #     response = self.app.post('/users/dummyid/runs', data='{"name":"joe"}', content_type='application/json')
    #     print('+ Test: POST to /users/<userid>/runs')

    #     print(' - Expect to be able to post to /users/<userid>/runs.')
    #     assert response.status_code == 200, "Expect 200 OK: Got: %d" %response.status_code

    #     print(' - Expect database to have one "run" entry')
    #     assert len(Run.query.all()) == 1

    #     print(' - Expect server to return an id of 1 in response body')
    #     returned_run_id = json.loads(response.data.decode("utf-8")).get('id')
    #     assert returned_run_id == 1

    # def test_0100_handle_get_user_run_with_non_existent_userid(self):
    #     print('+ Test GET to /users/<userid>/runs/<runid> with non-existent userid')

    #     # POST to populate database with a run
    #     response = self.app.post('/users/joe/runs', data='{"name":"joe run 1"}', content_type='application/json')
    #     returned_run_id = json.loads(response.data.decode("utf-8")).get('id')

    #     response = self.app.get('/users/non_existent/runs/%d' %returned_run_id)

    #     if response.data is None or response.data == b"":
    #         response_data = ""
    #     else:
    #         print('%s' % response.data)
    #         response_data = json.loads(response.data.decode("utf-8"))

    #     print(' - Expect database to return 404')
    #     assert response.status_code == 404, "Returned status code: %d and response body: %s" % (response.status_code, response_data)


    # def test_0110_handle_get_user_run_with_valid_userid(self):
    #     print('+ Test GET to /users/<userid>/runs/<runid> with valid userid and runid')

    #     # POST to populate database with a run
    #     response = self.app.post('/users/joe/runs', data='{"name":"joe run 1"}', content_type='application/json')
    #     returned_run_id = json.loads(response.data.decode("utf-8")).get('id')

    #     response = self.app.get('/users/joe/runs/%d' %returned_run_id)
    #     print(' - Expect database to return 200')
    #     assert response.status_code == 200

    #     response_data = json.loads(response.data.decode("utf-8"))
    #     print(' - Expect server to return the previous run stored')
    #     assert response_data.get('name') == "joe run 1" 


    # def test_0120_handle_delete_user_run_with_invalid_userid(self):
    #     print('+ Test DELETE to /users/<userid>/runs/<runid> with non-existent userid')

    #     # POST to populate database with a run
    #     response = self.app.post('/users/joe/runs', data='{"name":"joe run 1"}', content_type='application/json')
    #     returned_run_id = json.loads(response.data.decode("utf-8")).get('id')

    #     response = self.app.get('/users/non_existent/runs/%d' %returned_run_id)
    #     print(' - Expect database to return 404')
    #     assert response.status_code == 404

    #     response = self.app.get('/users/joe/runs')
    #     response_data = json.loads(response.data.decode("utf-8"))        
    #     print(' - Expect server to return one saved and not-deleted runs')
    #     assert len(response_data) == 1


    # def test_0130_handle_delete_user_run_with_valid_userid_and_run_id(self):
    #     print('+ Test DELETE to /users/<userid>/runs/<runid> with valid userid and valid run_id')

    #     # POST to populate database with a run
    #     response = self.app.post('/users/joe/runs', data='{"name":"joe run 1"}', content_type='application/json')
    #     returned_run_id = json.loads(response.data.decode("utf-8")).get('id')

    #     response = self.app.get('/users/joe/runs/%d' %returned_run_id)
    #     print(' - Expect database to return 200')
    #     assert response.status_code == 200


if __name__ == '__main__':
    unittest.main()