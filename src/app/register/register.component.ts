import { Component, OnInit } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {MessagesModule} from 'primeng/primeng';
import {Router} from '@angular/router';
import { MsgService } from '../msg.service';
import { LocalStorageService } from '../localstorage.service';

declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  
})
export class RegisterComponent implements OnInit {

  public myForm: FormGroup; 


  	constructor(public fb: FormBuilder, public http: Http, private router: Router, public servicio: MsgService, public serv: LocalStorageService) { 
  		
  		this.myForm = this.fb.group({
        username: ["",Validators.required],
  	  	email: ["",Validators.compose([Validators.required,Validators.email ])],
  	  	password: ["",Validators.compose([Validators.required,Validators.minLength(6)])],
        repeat: ["",Validators.compose([Validators.required,Validators.minLength(6)])],
        name: ["",Validators.required],
        lastname: ["",Validators.required],
        birthdate: ["",Validators.required],
        gender: ["",Validators.compose([Validators.required,Validators.minLength(6)])]
      });
  	}

  	ngOnInit() {
      if (this.serv.get_local_storage() != null){
        this.servicio.msgs = [];
        this.servicio.msgs.push({severity:'warn', summary:'', detail:'Ya has iniciado sesión.'});
        this.router.navigate(['']);
        setTimeout(() => {
        this.servicio.msgs = []; }, 5000);
      }
  	}

 /* checkPassword( fieldControl: FormControl) {
    console.log("hola");
    if (fieldControl.value.password==fieldControl.value.repeat){
      return true;
    }
    else{
      return false;
    } 
  }*/

  check(value1, value2) {
    var tam1 = value1.toString().length;
    var tam2 = value2.toString().length;

    if (tam1 >= 6 && tam2 >= 6 && value1 == value2){
      $("#register").attr('disabled',false);
      return true;
    }
    else{
      $("#register").attr('disabled',true);
      return false;
      
    } 
  }

  register () {
  	let formData = this.myForm.value;
  	var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (this.serv.get_local_storage()!= null) {
      headers.append( 'Authorization', this.serv.get_local_storage());
    }

    this.http.post('http://localhost:5000/registro', JSON.stringify(formData),{ headers: headers })      
  	.subscribe(data => {
              if (data.json().error == true){
                this.servicio.msgs = [];
                this.servicio.msgs.push({severity:'error', summary:'Error', detail:data.json().mensaje});
                setTimeout(() => {
                  this.servicio.msgs = [];}, 5000);
              }
              else{ 
                this.servicio.msgs = [];
                this.servicio.msgs.push({severity:'success', summary:'', detail:data.json().mensaje});
                setTimeout(() => {
                this.servicio.msgs = [];
                this.router.navigate(['./login']); 
                
                }, 5000);
              }
      }, error => {
          console.log(error.json());
      });

  }

}
