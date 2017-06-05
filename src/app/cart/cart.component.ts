import { Component, OnInit } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MsgService } from '../msg.service';
import { LocalStorageService } from '../localstorage.service';
import {Router} from '@angular/router';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
   carrito;
   monto;
   private user;
   public myForm: FormGroup; 

  constructor(public fb: FormBuilder, public http: Http, public servicio: MsgService,public serv: LocalStorageService,private router: Router) { 
	this.myForm = this.fb.group({	
        Titular: ["",Validators.required],
        Titular_CI: ["",Validators.required],
        NumeroDeTarjeta: ["",Validators.compose([Validators.required,Validators.minLength(16), Validators.maxLength(16)])],
        FechaDeVencimiento: ["",Validators.required],
  	  	Telefono: ["",Validators.compose([Validators.required,Validators.minLength(11), Validators.maxLength(11)])],
  	  	Direccion: ["",Validators.required],
      });
  }

  ngOnInit() {
  	if (this.serv.get_local_storage() == null){
      this.servicio.msgs = [];
      this.servicio.msgs.push({severity:'error', summary:'Acceso denegado', detail:'Debes iniciar sesión'});
      this.router.navigate(['./login']);
      setTimeout(() => {
      this.servicio.msgs = []; }, 5000);
                
     }
     else{
     	this.refresh();

     }
  	
  }

  refresh(){
  	var headers = new Headers();
    	if (this.serv.get_local_storage()!= null) {
      		headers.append( 'Authorization', this.serv.get_local_storage());
      		headers.append( 'username', this.serv.get_username());
    	}

  		this.http.get('http://localhost:5000/carrito',{ headers: headers })
			.subscribe(data => {
				if (data.json().error == true){
					//console.log(data.json)
					this.servicio.msgs = [];
        			this.servicio.msgs.push({severity:'info', summary:'', detail:data.json().mensaje});
        			$("#pagar").hide();
					this.carrito = [];
					setTimeout(() => {
    					this.servicio.msgs = []; }, 5000);
				}
				else{
					this.user = data.json()[0].id_user;
					$("#pagar").show();
					this.carrito = data.json();
				}
      		}, error => {
          		console.log(error.json());
      		})
  }

  cant(id_user,id_prod, opcion){
		 var headers = new Headers();
	    headers.append('Content-Type', 'application/json');

	     if (this.serv.get_local_storage()!= null) {
	          headers.append( 'Authorization', this.serv.get_local_storage());
	          headers.append( 'username', this.serv.get_username());
	     }

	    var json ={"id_user": id_user ,"id_prod": id_prod, "opcion":opcion};

	    this.http.put('http://localhost:5000/cant_carrito', JSON.stringify(json),{ headers: headers })      
	    .subscribe(data => {
	             if(data.json().error == true){
	                this.servicio.msgs = [];
	                this.servicio.msgs.push({severity:'error', summary:'', detail:data.json().mensaje});
	                setTimeout(() => {
	                this.servicio.msgs = []; }, 5000);
	                
	              }
	              else
	              {
	                  this.refresh();
	              }
	      }, error => {
	          console.log(error.json());
	      });  
		
	}

	delete(id_user,id_prod){
		var url = 'http://localhost:5000/delete_carrito/'+id_user+'/'+ id_prod;
		var headers = new Headers();
    	if (this.serv.get_local_storage()!= null) {
      		headers.append( 'Authorization', this.serv.get_local_storage());
      		headers.append( 'username', this.serv.get_username());
    	}

	
		this.http.delete(url,{ headers: headers })
			.subscribe(data => {
				if(data.json().error == true){
					this.servicio.msgs = [];
                	this.servicio.msgs.push({severity:'error', summary:'', detail:data.json().mensaje});
                	setTimeout(() => {
    					this.servicio.msgs = []; }, 5000);
				}
		      	else
		      	{
		      		this.refresh();
		            this.servicio.msgs = [];
                	this.servicio.msgs.push({severity:'success', summary:'', detail:data.json().mensaje});
		            setTimeout(() => {
    					this.servicio.msgs = []; }, 6000);
		      	}
      		}, error => {
          		console.log(error.json());
      		});	
	}

	factura(id_user){
		var headers = new Headers();
    	if (this.serv.get_local_storage()!= null) {
      		headers.append( 'Authorization', this.serv.get_local_storage());
      		headers.append( 'username', this.serv.get_username());
    	}


  		this.http.get('http://localhost:5000/total_carrito/'+id_user,{ headers: headers })
			.subscribe(data => {
				if (data.json().error == true){
					console.log(data.json)
					this.servicio.msgs = [];
        			this.servicio.msgs.push({severity:'error', summary:'Alerta', detail:data.json().mensaje});
					setTimeout(() => {
    					this.servicio.msgs = []; }, 5000);
				}
				else{
					this.monto = data.json().total;
					$('#TotalPay').text(data.json().total+"Bs");
				}
      		}, error => {
          		console.log(error.json());
      		})
	}

	pagar(id_user){
		let formData = this.myForm.value;

		var headers = new Headers();
    	headers.append('Content-Type', 'application/json');

    	var pedido = Math.floor(Math.random()*1000);

    	var fecha = formData.FechaDeVencimiento.split("-");
    	var mes = fecha[1];
    	var year = fecha[0].split("");
    	var anio = year[2]+year[3];
    	fecha = mes + '-' + anio;

    	var json = {'NumeroDeTarjeta':formData.NumeroDeTarjeta,
    			'Titular': formData.Titular,
    			'Titular_CI': formData.Titular_CI,
    			'FechaDeVencimiento': formData.FechaDeVencimiento,
    			'token':'9623042773',
    			'NumeroPedido':pedido,
    			'Monto': this.monto,
    			'rif_comercio':'10108795'
    			}

    	console.log(JSON.stringify(json));


 		this.http.post('https://apiunibank.herokuapp.com/empresas/boton-pago/pago', JSON.stringify(json),{ headers: headers })      
  			.subscribe(data => {
              if (data.json().data == '200'){
              	this.servicio.msgs = [];
                this.servicio.msgs.push({severity:'success', summary:'', detail:data.json().mensaje});
                this.actualizar_inventario(id_user);
              }
              else{ 
                this.servicio.msgs = [];
                this.servicio.msgs.push({severity:'error', summary:'', detail:data.json().mensaje});
                setTimeout(() => {
                this.servicio.msgs = [];}, 5000);
              }
      }, error => {
          console.log(error);
      });


		

	}

	actualizar_inventario(id_user){
		var headers = new Headers();
    	if (this.serv.get_local_storage()!= null) {
      		headers.append( 'Authorization', this.serv.get_local_storage());
      		headers.append( 'username', this.serv.get_username());
    	}


  		this.http.get('http://localhost:5000/pagar/'+id_user,{ headers: headers })
			.subscribe(data => {
				if (data.json().error == true){
					console.log(data.json)
					this.servicio.msgs = [];
        			this.servicio.msgs.push({severity:'error', summary:'', detail:data.json().mensaje});
					setTimeout(() => {
    					this.servicio.msgs = []; }, 5000);
				}
				else{
					this.router.navigate(['./productos']);  
                	this.servicio.msgs = [];
                	this.servicio.msgs.push({severity:'success', summary:'', detail:data.json().mensaje});
                	setTimeout(() => {
                	this.servicio.msgs = [];
                	}, 5000);
				}
      		}, error => {
          		console.log(error.json());
      		})
	}

}
