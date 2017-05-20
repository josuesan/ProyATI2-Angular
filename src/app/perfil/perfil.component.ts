import { Component, OnInit } from '@angular/core';
import { MsgService } from '../msg.service';
import { LocalStorageService } from '../localstorage.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Http, Headers} from '@angular/http';
import {Router} from '@angular/router';

declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
	
  public myForm: FormGroup;
  private idActual;
  private pwdActual;
  private emailActual;
  private usernameActual;
  constructor(public fb: FormBuilder, public http: Http, public servicio: MsgService, public serv: LocalStorageService, private router: Router) { 

	this.myForm = this.fb.group({
      username: ["",Validators.required],
	  	email: ["",Validators.compose([Validators.required,Validators.email ])],
	  	password: ["",Validators.minLength(6)],
      repeat: ["",Validators.minLength(6)],
      name: ["",Validators.required],
      lastname: ["",Validators.required],
      birthdate: ["",Validators.required],
      gender: ["",Validators.compose([Validators.required,Validators.minLength(6)])]
  		});
  }

  ngOnInit() { 
    var headers = new Headers();
    if (this.serv.get_local_storage()!= null) {
      headers.append( 'Authorization', this.serv.get_local_storage());
      headers.append( 'username', this.serv.get_username());
    }
    this.http.get('http://localhost:5000/perfil',{ headers: headers })      
    .subscribe(data => {
            if (data.json().error == true){
                this.router.navigate(['./login']);
                this.servicio.msgs = [];
                this.servicio.msgs.push({severity:'error', summary:'Error', detail:data.json().mensaje});
                setTimeout(() => {
                  this.servicio.msgs = [];}, 5000);
              }
              else{  
                this.myForm.setValue({username:data.json().username,
			      email:data.json().email,
			       name:data.json().nombre,
			      lastname:data.json().apellido,
			      birthdate:data.json().nacimiento,
			      gender:data.json().genero,
			      password:'',
            repeat: ''
    			});
              this.pwdActual = data.json().password;
              this.idActual = data.json().id;
              }       
      }, error => {
          console.log(error.json());
      });
  }

  check(value1, value2) {
    if (value1 == value2){
      return true;
    }
    else{
      return false;
    } 
  }


  activarCampos(){
    $("#username").attr("readonly", false);
    $("#email").attr("readonly", false);
    $("p").show();
    $("#pwd").show();
    $("#labelpwd").show();
    $("#repeat").show();
    $("#labelrepeat").show();
    $("#activar").hide();
    $("#editar").show();
  }

  desactivarCampos(){
    $("#username").attr("readonly", true);
    $("#email").attr("readonly", true);
    $("p").hide();
    $("#pwd").hide();
    $("#labelpwd").hide();
    $("#repeat").hide();
    $("#labelrepeat").hide();
    $("#activar").show();
    $("#editar").hide();
  }

  EditPerfil (){
    let formData = this.myForm.value;
    var headers = new Headers();
    var json;
    headers.append('Content-Type', 'application/json');

    if (this.serv.get_local_storage()!= null) {
      headers.append( 'Authorization', this.serv.get_local_storage());
      headers.append( 'username', this.serv.get_username());
    }

    if (formData.username != this.usernameActual || formData.email != this.emailActual || formData.password != ''){
        if (formData.password == ''){
          json = {'id':this.idActual,
                  'email':formData.email,
                  'username': formData.username,
                  'password': this.pwdActual
                };
        }
        else{
          json = {'id':this.idActual,
                  'email':formData.email,
                  'username': formData.username,
                  'password': formData.password
                };
        }
      this.http.put('http://localhost:5000/perfil/editar',JSON.stringify(json),{ headers: headers })      
      .subscribe(data => {
              if (data.json().error == true){
                  this.servicio.msgs = [];
                  
                  this.servicio.msgs.push({severity:'error', summary:'Error', detail:data.json().mensaje});
                  setTimeout(() => {
                    this.servicio.msgs = [];}, 5000);
                }
                else{  
                  this.desactivarCampos();
                  this.serv.set_username(formData.username);
                  this.servicio.msgs = [];
                  
                  this.servicio.msgs.push({severity:'success', summary:'', detail:data.json().mensaje});
                  setTimeout(() => {
                  this.servicio.msgs = [];}, 5000);
                }       
        }, error => {
            console.log(error.json());
        });
    }
  }
}
