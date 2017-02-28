from dbmodels import db, Run, DataPoint
from flask import Response

import json

def endpointtest():
  return '# Rows in "Challenges" table: %d' % len(Challenge.query.all())

