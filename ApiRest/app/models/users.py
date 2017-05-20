from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
import datetime

from app import db

class Users(db.Model):
	id = db.Column(db.Integer,primary_key=True)
	username = db.Column(db.String(50),unique=True)
	email = db.Column(db.String(40),unique=True)
	password = db.Column(db.VARCHAR(500))
	name = db.Column(db.String(50))
	lastName = db.Column(db.String(50))
	birthdate = db.Column(db.DateTime)
	gender = db.Column(db.String(50))
	admin = db.Column(db.Boolean)

	def create_user(self, username, email, password, name, lastName, birthdate,gender,admin):
		self.name = name
		self.lastName = lastName
		self.email = email
		self.username = username
		self.password = password
		self.birthdate = birthdate
		self.gender = gender
		self.admin = admin

	def exist_user(self, username, email):		
		aux = Users.query.filter_by(username=username).first()
		if aux is None:
			aux2 = Users.query.filter_by(email=email).first()
			if aux2 is None:
				return 0,0
			else:
				return 1,'email'
		return 1, 'username'

	def is_Admin(self, username):
		aux = Users.query.filter_by(username=username, admin = True).first()
		if aux is None:
			return False
		return True

	def login(self, username, pwd):
		aux = Users.query.filter_by(username=username).first()
		if aux is None:
			return 0
		return check_password_hash(aux.password,pwd)

	def exist_user_perfil(self, id_user, username, email):	
		usernameAnt =  Users.query.filter_by(id=id_user).first().username	
		aux = Users.query.filter_by(username=username).first()
		if aux is None:
			aux2 = Users.query.filter_by(email=email).first()
			if aux2 is None:
				return 0,usernameAnt
			else:
				if aux2.id == id_user:
					return 0,usernameAnt
				else:
					return 1,'email'

		if aux.id == id_user:
			return 0,usernameAnt
		else:
			return 1, 'username'

	def edit_perfil(self, id_user, email, username, pwd):
		aux = Users.query.filter_by(id=id_user).first()
		aux.email = email
		aux.username = username
		aux.password = pwd
		
		
	def get_user(self, usuario):		
		aux = Users.query.filter_by(username=usuario).first()
		fecha = str(aux.birthdate.year)+'-'+str(aux.birthdate.month)+'-'+str(aux.birthdate.day)
		if aux is None:
			return 0
		return {'id': aux.id, 'nombre': aux.name,'apellido':aux.lastName,'username': aux.username,'email':aux.email,'password': aux.password, 'nacimiento': fecha, 'genero':aux.gender}

	def create_password(self, pwd):
		return generate_password_hash(pwd)

	def verify_password(self, session, token):
		return check_password_hash(session,token)	

	