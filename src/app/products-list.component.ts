import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { Http, Headers} from '@angular/http';
//import { Product }  from './product-show.component';
import { MsgService } from './msg.service';
import { LocalStorageService } from './localstorage.service';
import {Router} from '@angular/router';



@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products.css']
})

export class ProductsList {
  products;

  //@ViewChild(Product)
  //private P: Product;

  	//@Output() Editar = new EventEmitter();
	
	constructor(public http: Http, public servicio: MsgService, public serv: LocalStorageService,private router: Router) {
		this.http.get('http://localhost:5000/listar')
			.subscribe(data => {
				if (data.json().error == true){
					this.servicio.msgs = [];
        			this.servicio.msgs.push({severity:'info', summary:'', detail:data.json().mensaje});
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

	
}
