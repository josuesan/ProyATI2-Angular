# Import flask and template operators
from flask import Flask, render_template

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')


# Define the database object which is imported
# by modules and controllers
db = SQLAlchemy(app)


from app import views
