import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { Http, Headers} from '@angular/http';
//import { Product }  from './product-show.component';
import { MsgService } from './msg.service';
import { LocalStorageService } from './localstorage.service';
import {Router} from '@angular/router';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products.css']
})

export class ProductsList {
  products;

	constructor(public http: Http, public servicio: MsgService, public serv: LocalStorageService,private router: Router) {
		this.http.get('http://localhost:5000/listar')
			.subscribe(data => {
				if (data.json().error == true){
					this.servicio.msgs = [];
        			this.servicio.msgs.push({severity:'warn', summary:'Alerta', detail:data.json().mensaje});
					this.products = [];
					setTimeout(() => {
    					this.servicio.msgs = []; }, 5000);
				}
				else{
					this.products = data.json();
					this.list(this.products);
				}
      		}, error => {
          		console.log(error.json());
      		});
	}

	refresh(){
		this.http.get('http://localhost:5000/listar')
			.subscribe(data => {
				if (data.json().error == true){
					this.servicio.msgs = [];
        			this.servicio.msgs.push({severity:'warn', summary:'Alerta', detail:data.json().mensaje});
					this.products = [];
					setTimeout(() => {
    					this.servicio.msgs = []; }, 5000);
				}
				else{
					this.products = data.json();
				}
      		}, error => {
          		console.log(error.json());
      		});
	}

	show(id){
		this.router.navigate(['./producto/'+id]);
	}
	list (productos){
    	var tam = productos.length ;
    	var i;
    	console.log(productos);
    	for (i = 0; i < tam; i++) {
	      console.log("producto con ventas de :"+productos[i].sell);
	      var fila = $('<div/>', {
	        'class' : 'col-sm-6 col-md-6 col-lg-4',
	        'id'    : 'Fila_' + i
	      });

	      $(".product-list").append(fila);

	      var panelTotal = $('<div/>', {
	        'class' : 'panel panel-default panelProduct',
	        'id'    : 'panel-id_' + i
	      });

	      $("#Fila_"+i).append(panelTotal);

	      var panelHead = $('<div/>', {
	        'class' : 'panel-heading',
	        'id'    : 'panelhead-id_' + i
	      });
	      var panelbody = $('<div/>', {
	        'class' : 'panel-body',
	        'id'    : 'panelbody-id_' + i
	      });
	      var panelfooter = $('<div/>', {
	        'class' : 'panel-footer',
	        'id'    : 'panelfooter-id_' + i
	      });

	      $("#panel-id_"+i).append(panelHead);
	      $("#panel-id_"+i).append(panelbody);
	      $("#panel-id_"+i).append(panelfooter);

	      panelHead = $("<h4></h4>").text(productos[i].name);
	      $("#panelhead-id_"+i).append(panelHead);
	          
	      // agregar imagen al panel body
	      panelbody = $('<img/>', {
	        'class' : 'img-responsive',
	        'id'    : 'image_' + i,
	        'src'   : productos[i].img
	      });
	      $("#panelbody-id_"+i).append(panelbody);

	      var precio = $("<p></p>").text("Precio: "+productos[i].price+"BsF");
	      $("#panelfooter-id_"+i).append(precio);

	      panelfooter = $('<a/>', {
	        'href'    : '/producto/' + productos[i].id
	      });
	      panelfooter.text("Ver mas");
	      $("#panelfooter-id_"+i).append(panelfooter);      
    	}   
  	};
}
