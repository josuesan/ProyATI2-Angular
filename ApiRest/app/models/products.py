from flask_sqlalchemy import SQLAlchemy
import datetime
from collections import OrderedDict
#from app.models.carrito import Carrito
import  json
from app import db

class productos(db.Model):
	__tablename__ = 'product'
	id = db.Column(db.Integer,primary_key=True)
	nombre = db.Column(db.VARCHAR(500),unique=True)
	precio = db.Column(db.Integer)
	foto = db.Column(db.VARCHAR(500))
	descripcion = db.Column(db.VARCHAR(500))
	categoria = db.Column(db.String(50))
	vendido = db.Column(db.Integer)
	carrito = db.relationship('Carrito', backref='product',cascade="all, delete-orphan" ,lazy='dynamic')


	def create_prod(self, nombre, precio, foto, descripcion, categoria, vendido):
		self.nombre = nombre
		self.precio = precio
		self.foto = foto
		self.descripcion = descripcion
		self.categoria = categoria
		self.vendido = vendido

	def get_prod(self, id):		
		aux = productos.query.filter_by(id=id).first()
		if aux is None:
			return 0
		return {'id':aux.id,'name': aux.nombre,'price':aux.precio,'img': aux.foto,'description':aux.descripcion,'category': aux.categoria,'sell':aux.vendido}

	def get_prod_category(self,category):
		aux = productos.query.filter_by(categoria=category).all()
		if aux is []:
			return 0
		return aux

	def get_prod_ord(self,nom_precio):
		if nom_precio == "Nombre":
			aux = productos.query.order_by(productos.nombre.asc()).all()
		else:
			aux = productos.query.order_by(productos.precio.asc()).all()

		if aux is []:
			return 0
		return aux

	def get_prod_destacados(self):
		aux = productos.query.filter(productos.vendido >= 20).order_by(productos.vendido.desc()).all()
		if aux is []:
			return 0
		return aux


	def get_object(self,id):
		return productos.query.filter_by(id=id)

	def all_prod(self):		
		aux = productos.query.all()
		tam = len(aux)
		if tam == 0:
			return 0
		return aux

	def number_prod(self):		
		return productos.query.count()

	def convert(self, lista, cantidad):
		jsona = [{'id':lista[i].id,'name':lista[i].nombre,'price':lista[i].precio,'img':lista[i].foto,'description':lista[i].descripcion,'category':lista[i].categoria,'sell':lista[i].vendido} for i in range(0,cantidad)]
		return jsona

	def set_prod(self, id, nombre, precio, foto, descripcion, categoria, vendido):	
		#Retorno el objecto de la bd y el registro nuevo a almacenar
		return productos.query.filter_by(id=id), {'id': id,'nombre': nombre,'precio': precio,'foto': foto,'descripcion': descripcion,'categoria': categoria,'vendido':vendido}

	def delete_prod(self, id):		
		aux = productos.query.get(id)
		if aux is None:
			return 0 
		return aux 
		
