import { Component, OnInit } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {MessagesModule} from 'primeng/primeng';
import {Router} from '@angular/router';
import { MsgService } from '../msg.service';
import { LocalStorageService } from '../localstorage.service';



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
    if (value1 == value2){
      return true;
    }
    else{
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
                this.router.navigate(['./login']); 
                this.servicio.msgs = [];
                this.servicio.msgs.push({severity:'success', summary:'', detail:data.json().mensaje});
                setTimeout(() => {
                this.servicio.msgs = [];
                
                }, 5000);
              }
      }, error => {
          console.log(error.json());
      });

  }

}
