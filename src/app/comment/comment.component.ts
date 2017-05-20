import { Component, OnInit } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MsgService } from '../msg.service';
import { LocalStorageService } from '../localstorage.service';
import {Router} from '@angular/router';

declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments;
  private user;
  private comentario;
  public myForm: FormGroup;

  constructor(public fb: FormBuilder, public http: Http, public servicio: MsgService,public serv: LocalStorageService,private router: Router) { 
   	this.myForm = this.fb.group({
      comentario: ["",Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(140)])],
      fecha:[""]
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
  	this.http.get('http://localhost:5000/comentarios',{ headers: headers })
			.subscribe(data => {
				if (data.json().error == true){
					this.servicio.msgs = [];
        			this.servicio.msgs.push({severity:'warn', summary:'Alerta', detail:data.json().mensaje});
					this.comments = [];
					setTimeout(() => {
    					this.servicio.msgs = []; }, 5000);
				}
				else{
					this.comments = data.json();
				}
      		}, error => {
          		console.log(error.json());
      		});
  }

  create_comment () {
  	let formData = this.myForm.value;
  	var headers = new Headers();
    headers.append('Content-Type', 'application/json');
      if (this.serv.get_local_storage()!= null) {
          headers.append( 'Authorization', this.serv.get_local_storage());
          headers.append( 'username', this.serv.get_username());
      }
    
    formData.fecha = this.get_Fecha();
  	this.http.post('http://localhost:5000/agregar_comentario', JSON.stringify(formData),{ headers: headers })      
  	.subscribe(data => {
            this.refresh();
            this.mostrar_form();
            this.servicio.msgs = [];
            this.servicio.msgs.push({severity:'success', summary:'', detail:data.json().mensaje});
            //$("input").val('');
            //this.PL.refresh();
            setTimeout(() => {
            this.servicio.msgs = []; }, 5000);
           
      }, error => {
          console.log(error.json());
      });
  }
  mostrar_form(){
  	window.scrollTo(0,0);
  	$("#h2edit").hide();
	$("#h2new").show();
  	$("#comm").val('');
	$("#crear").show();
	$("#editar").hide();
	$("#agregar").hide();

  }

  	destroy(id_user,id_comment){
		var url = 'http://localhost:5000/delete_comentario/'+id_user+'/'+ id_comment;
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
		      		this.mostrar_form();
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

	mostrar(id_user,id_comment,comm){
		this.user = id_user;
		this.comentario = id_comment;
		$("#h2edit").show();
		$("#h2new").hide();
		$("#crear").hide();
		$("#editar").show();
		$("#agregar").show();

		this.myForm.setValue({
				comentario:comm,
         		fecha: ''
    	});
	}

	 edit(id_user,id_comment) {
	    let formData = this.myForm.value;
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/json');

	     if (this.serv.get_local_storage()!= null) {
	          headers.append( 'Authorization', this.serv.get_local_storage());
	          headers.append( 'username', this.serv.get_username());
	     }

	    var json = {'id_user':id_user, 'id_comment': id_comment, 'comentario': formData.comentario, 'fecha':this.get_Fecha()}

	    this.http.put('http://localhost:5000/editar_comentario', JSON.stringify(json),{ headers: headers })      
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
	                  //this.PL.show(id);
	                  //this.PL.refresh();
	                  setTimeout(() => {
	                  this.servicio.msgs = []; }, 5000);
	              }
	      }, error => {
	          console.log(error.json());
	      });     
  }

  get_Fecha(){
  	var today = new Date();
  	var month = today.getUTCMonth() + 1; //months from 1-12
	  var day = today.getUTCDate();
  	var year = today.getUTCFullYear();

  	var newdate = year + "/" + month + "/" + day;
    	return newdate;
    }
}
