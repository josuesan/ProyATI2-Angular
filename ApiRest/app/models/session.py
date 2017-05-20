from flask_sqlalchemy import SQLAlchemy
import datetime
from collections import OrderedDict
from app.models.users import Users
import  json
from app import db

class Session(db.Model):
	id = db.Column(db.Integer,primary_key=True)
	username = db.Column(db.String(50),unique=True)
	email = db.Column(db.String(40),unique=True)
	token = db.Column(db.VARCHAR(500))
	admin = db.Column(db.Boolean)
	
	def create_session(self, username, token,admin):
		self.username = username
		self.token = token
		user = Users()
		usuario = user.get_user(username)
		self.email = usuario['email']
		self.admin = admin

	def exist_session(self, username, token):
		aux = Session.query.filter_by(username=username).first()
		if aux is None:
			return 0
		else:
			if aux.token == token:
				return 1
			else:
				return 0

	def edit_session(self, usernameAnt, email, username):
		aux = Session.query.filter_by(username=usernameAnt).first()
		aux.email = email
		aux.username = username
		

	def exist_sesion(self, username):
		aux = Session.query.filter_by(username=username).first()
		if aux is None:
			return 0
		else:
			return 1


	def delete_session(self, username):		
		aux = Session.query.filter_by(username=username).first()
		if aux is None:
			return 0 
		return aux 
		
			
