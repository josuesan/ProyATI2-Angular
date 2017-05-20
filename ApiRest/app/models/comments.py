from flask_sqlalchemy import SQLAlchemy
import datetime
from collections import OrderedDict
import  json
from app import db

class Comentarios(db.Model):
	__tablename__ = 'Comentarios'
	id = db.Column(db.Integer,primary_key=True)
	id_user = db.Column(db.Integer,db.ForeignKey('user.id'))
	comentario = db.Column(db.VARCHAR(500))
	fecha = db.Column(db.DateTime)
	
	def agg_comment(self,id_user, comment,fecha):
		self.id_user = id_user
		self.comentario = comment
		self.fecha = fecha

	def all_comments(self):		
		aux = Comentarios.query.all()
		tam = len(aux)
		if tam == 0:
			return 0
		return aux

	def get_comment(self,id_user, id):		
		aux = Comentarios.query.filter_by(id_user=id_user, id=id).first()
		fecha = str(aux.fecha.year)+'-'+str(aux.fecha.month)+'-'+str(aux.fecha.day)
		if aux is None:
			return 0
		return {'id_user':aux.id_user,'id_comment': aux.id,'comentario':aux.comentario,'fecha': fecha}

	def edit_comment(self, id_user, id, comentario,fecha):	
		aux = Comentarios.query.filter_by(id_user=id_user,id=id).first()
		aux.comentario = comentario
		aux.fecha = fecha

	def number_comments(self):		
		return Comentarios.query.count()

	def obtenerFecha(fecha):
		f = str(fecha.day)+'-'+str(fecha.month)+'-'+str(fecha.year)
		return f;


	def convert(self, lista, cantidad):
		jsona = [{'id_user':lista[i].id_user,'id_comment':lista[i].id,'comentario':lista[i].comentario, 'fecha':Comentarios.obtenerFecha(lista[i].fecha)} for i in range(0,cantidad)]
		return jsona

	def delete_comment(self, id_comment, id_user):		
		aux = Comentarios.query.filter_by(id=id_comment, id_user=id_user).first()
		if aux is None:
			return 0 
		return aux 

	
		
			
