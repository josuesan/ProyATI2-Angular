#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, make_response, session, redirect, url_for, flash, escape, jsonify
import os, json
from bson import json_util
from bson.objectid import ObjectId
from flask_sqlalchemy import SQLAlchemy
from app.models.users import Users
from app.models.products import productos
from app.models.carrito import Carrito
from app.models.comments import Comentarios
from app.models.session import Session
from flask_cors import CORS, cross_origin
from flask_wtf import CsrfProtect
from app import app, db
CORS(app)


db.create_all()
csrf = CsrfProtect()


#########################################------------USUARIOS-------------------#####################################

def create_session(username, admin):	
	user =Users()
	token = user.create_password("secret")
	sesion = Session()
	sesion.create_session(username,token,admin)
	db.session.add(sesion)
	db.session.commit()
	return token

@app.route('/logout', methods = ['GET'])
def logout():
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			deletesesion = sesion.delete_session(usuario)

			if deletesesion == 0:
				respuesta = {'error':True,'mensaje':'No has iniciado sesión.'}
				return json.dumps(respuesta)
			else: 
				db.session.delete(deletesesion)
				db.session.commit()
				respuesta = {'error':False,'mensaje':'Cerraste sesión correctamente'}
				return json.dumps(respuesta)

	respuesta = {'error':True,'mensaje': 'Ya has iniciado sesión.'} 
	return json.dumps(respuesta)	

@app.route("/login", methods = ['POST'])
def log_user():
	sesion = Session()
	new = request.get_json()
	usuario = new['username']
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			respuesta = {'error':True,'mensaje': 'Ya has iniciado sesión.'} 
			return json.dumps(respuesta)

	user = Users()
	clave = new['password']		
	
	if sesion.exist_sesion(usuario) :
		deletesesion = sesion.delete_session(usuario)
		db.session.delete(deletesesion)
		db.session.commit()		
	
	if user.login(usuario,clave) :
		res = create_session(usuario, user.is_Admin(usuario))
		respuesta = {'error':False,'mensaje':'Inicio de sesión exitoso.','token': res}
		return json.dumps(respuesta)
	else:
		respuesta = {'error':True,'mensaje':'Usuario o Contraseña incorrectos.'} 
		return json.dumps(respuesta)

@app.route("/perfil", methods = ['GET'])
def perfil():
	sesion = Session()
	new = request.get_json()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	print(usuario)
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			user = Users()
			datos = user.get_user(usuario)
			return json.dumps(datos)

	respuesta = {'error':True,'mensaje': 'No has iniciado sesión.'} 
	return json.dumps(respuesta)   

@app.route('/registro', methods = ['POST'])
def Register():
	sesion = Session()
	new = request.get_json()
	usuario = new['username']
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if not token_angular:
		if not sesion.exist_session(usuario, token_angular):
			user = Users()
			(exist,campo) = user.exist_user(new['username'],new['email'])
			if exist == 1:
				if campo == 'email':
					respuesta = {'error':True,'mensaje':'Email registrado.'}
				else:
					respuesta = {'error':True,'mensaje':'Username registrado.'}
				
				return json.dumps(respuesta)
			else:
				user.create_user(new['username'],
							new['email'],
							user.create_password(new['password']),
							new['name'],
							new['lastname'],
							new['birthdate'],
							new['gender'],
							False)
				db.session.add(user)
				db.session.commit()

				respuesta = {'error':False,'mensaje':'Registro exitoso, serás redireccionado al inicio de sesión.'}
				return json.dumps(respuesta)

	respuesta = {'error':True,'mensaje':'Ya has iniciado sesión'}
	return json.dumps(respuesta)

@app.route('/perfil/editar', methods=['PUT'])
def editPerfil():
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			user = Users()
			NewUser = request.get_json()
			valido,error = user.exist_user_perfil(NewUser['id'],NewUser['username'],NewUser['email'])
			if valido == 0:
				password = user.create_password(NewUser['password'])
				user.edit_perfil(NewUser['id'],NewUser['email'],NewUser['username'],password)
				sesion = Session()
				sesion.edit_session(error,NewUser['email'],NewUser['username'])
				db.session.commit()
				
				respuesta = {'error':False,'mensaje':'Perfil editado exitosamente.'}
				return json.dumps(respuesta)
			else:
				if error == 'email':
					respuesta = {'error':True,'mensaje':'Email ya registrado, seleccione otro.'}
					return json.dumps(respuesta)
				else:
					respuesta = {'error':True,'mensaje':'Nombre de usuario ya registrado, seleccione otro.'}
					return json.dumps(respuesta)
	
	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.',"token" : token_angular}
	return json.dumps(respuesta)	

#########################################------------PRODUCTOS-------------------#####################################
@app.route('/listar', methods = ['GET'])
def list():
	prod =productos()
	lista = prod.all_prod()
	if lista == 0:
		respuesta = {'error':True,'mensaje':'No hay artículos disponibles'} 
		print(jsonify(respuesta))
		return jsonify(respuesta)

	number = prod.number_prod()
	jsona = prod.convert(lista,number)
	print(jsona)
	return jsonify(jsona)

@app.route('/listar/<ide>', methods = ['GET'])
def part(ide):
	if ide.isdigit():
		_id = ide
		prod =productos()
		oneProd = prod.get_prod(_id)
		if oneProd == 0:
			respuesta = {'error':True,'mensaje':'Producto no existe'}
			return json.dumps(respuesta)
		else:
			oneProd = prod.get_prod(_id)
			return json.dumps(oneProd)
	respuesta = {'error':True,'mensaje':'Producto no existe.'}
	return json.dumps(respuesta)



@app.route('/crear', methods = ['POST'])
def create():	
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			oneProd =productos()
			product = request.get_json()
			oneProd.create_prod(product['name'],product['price'],product['img'],product['description'],product['category'],product['sell'])
			db.session.add(oneProd)
			db.session.commit()
			respuesta = {'error':False,'mensaje':'Producto creado exitosamente.'}
			return json.dumps(respuesta)
	
	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)


@app.route('/editar/<ide>', methods=['PUT'])
def edit(ide):
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			if ide.isdigit():
				_id = ide
				prod =productos()
				oneProd = prod.get_prod(_id)
				if oneProd == 0:
					respuesta = {'error':True,'mensaje':'Producto no existe'}
					return json.dumps(respuesta)
				else:
					product = request.get_json()
					#obtengo el objeto del producto de la bd para poder editarlo y obtengo el nuevo registro a almacenar
					(objProd,prodEdit) = prod.set_prod(_id, product['name'], product['price'], product['img'], product['description'], product['category'], product['sell'])

					objProd.update(prodEdit)  #edito el artículo
					db.session.commit() #guardo los cammbios
					respuesta = {'error':False,'mensaje':'Producto editado exitosamente.'}
					return json.dumps(respuesta)

			respuesta = {'error':True,'mensaje':'Producto no existe.'}
			return json.dumps(respuesta)
	
	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)


@app.route('/borrar/<ide>', methods=['DELETE'])
def delete(ide):
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			if ide.isdigit():
				_id = ide	
				prod =productos()
				oneProd = prod.delete_prod(_id)
				if oneProd == 0:
					respuesta = {'error':True,'mensaje':'Producto no existe.'}
					return json.dumps(respuesta)
				else: 
					db.session.delete(oneProd)
					db.session.commit()
					respuesta = {'error':False,'mensaje':'Producto borrado exitosamente.'}
					return json.dumps(respuesta)

			respuesta = {'error':True,'mensaje':'Producto no existe.'}
			return json.dumps(respuesta)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)



#########################################------------CARRITO-------------------#####################################
@app.route('/carrito', methods = ['GET'])
def carrito():
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			car =Carrito()
			lista = car.all_car()
			if lista == 0:
				respuesta = {'error':True,'mensaje':'No hay artículos en el carrito.'} 
				return jsonify(respuesta)
			number = car.number_car()
			jsona = car.convert(lista,number)
			return jsonify(jsona)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)

@app.route('/agregar_carrito', methods = ['POST'])
def agregarcarrito():	
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			car =productos()
			datos = request.get_json()
			res = car.exist_prod(datos['id_user'],datos['id_prod'])
			if res == 1:
				car.agg_prod(datos['id_user'],datos['id_prod'])
				db.session.add(car)
				respuesta = {'error':False,'mensaje':'Producto agregado exitosamente.'}
			else: 
				respuesta = {'error':False,'mensaje':'Cantidad aumentada exitosamente.'}

			db.session.commit()
			return json.dumps(respuesta)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)

@app.route('/cant_carrito', methods = ['PUT'])
def cantcarrito():
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			info = request.get_json()
			car = Carrito()
			res = car.adm_cant(info['id_user'],info['id_prod'],info['opcion'])
			if res == 0:
				#Eliminamos el producto del carrito debido a que se resto la cantidad que estaba en 1
				oneProd = car.delete_prod(info['id_prod'],info['id_user'])
				if oneProd != 0:
					db.session.delete(oneProd)
				respuesta = {'error':False,'mensaje':'Producto eliminado del carrito.'}
			else:
				respuesta = {'error':False,'mensaje':'Cantidad editada exitosamente.'} 

			db.session.commit()
			return jsonify(respuesta)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)


@app.route('/delete_carrito/<user>/<prod>', methods=['DELETE'])
def deletecarrito(user,prod):
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			if user.isdigit() and prod.isdigit():	
				car = Carrito()
				oneProd = car.delete_prod(prod,user)
				if oneProd == 0:
					respuesta = {'error':True,'mensaje':'Producto no existe.'}
					return json.dumps(respuesta)
				else: 
					db.session.delete(oneProd)
					db.session.commit()
					respuesta = {'error':False,'mensaje':'Producto borrado del carrito.'}
					return json.dumps(respuesta)

			respuesta = {'error':True,'mensaje':'Producto o Usuario no existe'}
			return json.dumps(respuesta)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)


@app.route('/total_carrito/<user>', methods=['GET'])
def totalcarrito(user):
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			if user.isdigit():	
				car = Carrito()
				total = car.get_total_price(user)
				respuesta = {'total':total }
				return json.dumps(respuesta)

			respuesta = {'error':True,'mensaje':'Usuario no existe.'}
			return json.dumps(respuesta)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)

@app.route('/pagar/<user>', methods=['GET'])
def pagar(user):
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			if user.isdigit():	
				car = Carrito()
				res = car.all_prod(user)
				if res == 0:
					respuesta = {'error':True,'mensaje':'No hay productos en el carrito.'}
					return json.dumps(respuesta)
				else:
					car.aumentar_vendido(user,res)
					for prod in res:
						db.session.delete(prod)
				
				db.session.commit()
				respuesta = {'error':False,'mensaje':'Su compra ha sido exitosa.'}
				return json.dumps(respuesta)

			respuesta = {'error':True,'mensaje':'Usuario no existe.'}
			return json.dumps(respuesta)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)




#########################################------------COMENTARIOS-------------------#####################################
@app.route('/comentarios', methods = ['GET'])
def comments():
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			comm =Comentarios()
			lista = comm.all_comments()
			if lista == 0:
				respuesta = {'error':True,'mensaje':'No hay comentarios.'} 
				return jsonify(respuesta)

			number = comm.number_comments()
			jsona = comm.convert(lista,number)
			return jsonify(jsona)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)

@app.route('/agregar_comentario', methods = ['POST'])
def agregarcomentario():	
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			comm =Comentarios()
			user = Users()
			user = user.get_user(usuario)
			datos = request.get_json()
			comm.agg_comment(user['id'],datos['comentario'],datos['fecha'])
			db.session.add(comm)
			db.session.commit()
			respuesta = {'error':False,'mensaje':'Comentario agregado exitosamente.'}
			return json.dumps(respuesta)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)

@app.route('/editar_comentario', methods = ['PUT'])
def editarcomentario():
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			comm = Comentarios()
			info = request.get_json()
			res = comm.get_comment(info['id_user'],info['id_comment'])
			if res == 0:
				respuesta = {'error':True,'mensaje':'Comentario no existe.'}
				return json.dumps(respuesta)			
			else:
				comm.edit_comment(info['id_user'],info['id_comment'],info['comentario'],info['fecha'])
				db.session.commit() #guardo los cammbios
				respuesta = {'error':False,'mensaje':'Comentario editado exitosamente.'}
				return json.dumps(respuesta)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)


@app.route('/delete_comentario/<user>/<comment>', methods=['DELETE'])
def deletecomentario(user,comment):
	sesion = Session()
	usuario = request.headers.get('username')
	token_angular = request.headers.get('Authorization')
	#Verificamos si el usuario tiene una sesión activa
	if token_angular:
		if sesion.exist_session(usuario, token_angular):
			if user.isdigit() and comment.isdigit():	
				comm = Comentarios()
				oneComm = comm.delete_comment(comment,user)
				if oneComm == 0:
					respuesta = {'error':True,'mensaje':'Comentario no existe.'}
					return json.dumps(respuesta)
				else: 
					db.session.delete(oneComm)
					db.session.commit()
					respuesta = {'error':False,'mensaje':'Comentario borrado exitosamente.'}
					return json.dumps(respuesta)

			respuesta = {'error':True,'mensaje':'Comentario o Usuario no existe.'}
			return json.dumps(respuesta)

	respuesta = {'error':True,'mensaje':'Debes iniciar sesión.'}
	return json.dumps(respuesta)


