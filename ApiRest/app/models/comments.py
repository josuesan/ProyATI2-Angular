from flask_sqlalchemy import SQLAlchemy
import datetime
from collections import OrderedDict
import  json
from app import db

class Comentarios(db.Model):
	id = db.Column(db.Integer,primary_key=True)
	id_user = db.Column(db.Integer,primary_key=True)
	comentario = db.Column(db.VARCHAR(500))
	
	def agg_comment(self,id_user, comment):
		self.id_user = id_user
		self.comentario = comment

	def all_comments(self):		
		aux = Comentarios.query.all()
		tam = len(aux)
		if tam == 0:
			return 0
		return aux

	def get_comment(self,id_user, id):		
		aux = productos.query.filter_by(id_user=id_user, id=id).first()
		if aux is None:
			return 0
		return {'id':aux.id,'name': aux.nombre,'price':aux.precio,'img': aux.foto,'description':aux.descripcion,'category': aux.categoria,'sell':aux.vendido}

	def edit_comment(self, id_user, id, comentario):	
		aux = Carrito.query.filter_by(id_user=id_user,id=id).first()
		aux.comentario = comentario

	def number_comments(self):		
		return Comentarios.query.count()

	def convert(self, lista, cantidad):
		jsona = [{'id_user':lista[i].id_user,'id_comment':lista[i].id,'comment':lista[i].comentario} for i in range(0,cantidad)]
		return jsona

	def delete_comment(self, id_comment, id_user):		
		aux = Comentarios.query.filter_by(id=id_comment, id_user=id_user).first()
		if aux is None:
			return 0 
		return aux 

	
		
			
