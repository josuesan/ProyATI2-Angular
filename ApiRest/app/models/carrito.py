from flask_sqlalchemy import SQLAlchemy
import datetime
from collections import OrderedDict
import  json
from app.models.products import productos
from app import db

class Carrito(db.Model):
	id_user = db.Column(db.Integer,primary_key=True)
	id_prod = db.Column(db.Integer,db.ForeignKey('product.id'),primary_key=True)
	nombre_producto = db.Column(db.VARCHAR(500))
	imagen = db.Column(db.VARCHAR(500))
	precio = db.Column(db.Integer)
	cantidad = db.Column(db.Integer)
	
	def agg_prod(self, id_user, id_prod):
		self.id_user = id_user
		self.id_prod = id_prod
		prod = productos()
		product = prod.get_prod(id_prod)
		self.nombre_producto = product['name']
		self.precio = product['price']
		self.imagen = product['img']
		self.cantidad = 1

	def exist_prod(self,id_user,id_prod):
		aux = Carrito.query.filter_by(id_user=id_user,id_prod=id_prod).first()
		if aux is None:
			return 1
		else:
			aux.cantidad += 1
			return 0


	def adm_cant(self, id_user, id_prod, opcion):
		aux = Carrito.query.filter_by(id_user=id_user,id_prod=id_prod).first()
		if aux.cantidad == 1 and opcion == "restar":
			return 0
		else:
			if opcion == "restar":
				aux.cantidad -= 1
			else:
				aux.cantidad += 1
			return 1


	def get_total_price(self, id_user):		
		aux = Carrito.query.filter_by(id_user=id_user)
		if aux is None:
			return 0
		else: 
			total = 0
			for prod in aux:
				total = total + prod.precio*prod.cantidad

			return total

	def all_car(self):		
		aux = Carrito.query.all()
		tam = len(aux)
		if tam == 0:
			return 0
		return aux

	def number_car(self):		
		return Carrito.query.count()

	def convert(self, lista, cantidad):
		jsona = [{'id_user':lista[i].id_user,'id_prod':lista[i].id_prod,'name_prod':lista[i].nombre_producto,'price':lista[i].precio,'cant':lista[i].cantidad, 'img':lista[i].imagen} for i in range(0,cantidad)]
		return jsona

	def delete_prod(self, id_prod, id_user):		
		aux = Carrito.query.filter_by(id_prod=id_prod, id_user=id_user).first()
		if aux is None:
			return 0 
		return aux

	def all_prod(self, id_user):
		aux = Carrito.query.filter_by(id_user=id_user)
		if aux is None:
			return 0
		return aux

	def aumentar_vendido(self,id_user,products):
		for prod in products:
			aux = productos.query.filter_by(id=prod.id_prod).first()
			aux.vendido += prod.cantidad





	
		
			
