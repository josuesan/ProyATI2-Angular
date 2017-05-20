import { Component, EventEmitter, Output, OnInit   } from '@angular/core';
import { Http, Headers} from '@angular/http';
import {MessagesModule} from 'primeng/primeng';
import { MsgService } from './msg.service';
import { LocalStorageService } from './localstorage.service';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';



declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'product-show',
  templateUrl: './product-show.component.html',
  styleUrls: ['./products.css']
})

export class Product implements OnInit{
  product='';
  id: number;
  private sub: any;

	constructor(public http: Http, public servicio: MsgService, public serv: LocalStorageService, private route: ActivatedRoute, private router: Router) { }

	/*@Output() Refresh = new EventEmitter();
	@Output() Edit = new EventEmitter();*/

	show(id){
		//$("input").val('');
        //$("#create").show();
        //$("#edit").hide();
		var url = 'http://localhost:5000/listar/' + id;
		this.http.get(url)
			.subscribe(data => {
	            if(data.json().error == true){
					this.servicio.msgs = [];
                	this.servicio.msgs.push({severity:'error', summary:'', detail:data.json().mensaje});
                	setTimeout(() => {
    					this.servicio.msgs = []; }, 5000);
				}
		      	else
		      	{
		      		console.log(this.product);
		      		this.product = data.json();   
		            setTimeout(() => {
    					this.servicio.msgs = []; }, 5000);
		      	}
      		}, error => {
          		console.log(error.json());
      		});   		
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.id = +params['id'];
		});

		this.show(this.id);

	}

	destroy(id){
		var url = 'http://localhost:5000/borrar/' + id;
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
		      		this.router.navigate(['./productos']);
		            this.servicio.msgs = [];
                	this.servicio.msgs.push({severity:'success', summary:'', detail:data.json().mensaje});
		            //this.show(0);               	
		            //this.Refresh.emit();
		            setTimeout(() => {
    					this.servicio.msgs = []; }, 6000);
		      	}
      		}, error => {
          		console.log(error.json());
      		});	
	}

	editar(id){
		this.router.navigate(['./producto/editar/'+id]);
	}

}

