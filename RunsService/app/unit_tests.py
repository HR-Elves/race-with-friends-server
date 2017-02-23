from flask_testing import TestCase
from main import app, db
import unittest

class UserServiceTestCase(TestCase):

    def create_app(self):
        return app

    def setUp(self):
        self.app = app  
        app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://elves:elves@runsdb:5432/testdb'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True        
        app.config['TESTING'] = True
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_alwaysPass(self):
        assert 1 == 1, "This Should ALWAYS pass"

    def test_root_endpoint_exist(self):
        response = self.client.get("/")
        assert response.status_code == 200, "Root Endpoint Should Exist"

if __name__ == '__main__':
    unittest.main()