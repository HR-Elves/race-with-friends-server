FROM tiangolo/uwsgi-nginx-flask:flask-python3.5

RUN pip install Flask-SQLAlchemy
RUN pip install psycopg2

COPY ./app /app
