FROM tiangolo/uwsgi-nginx-flask:flask-python3.5

RUN pip install Flask-SQLAlchemy
RUN pip install psycopg2
RUN pip install Flask-Testing
RUN pip install requests

COPY ./app /app
