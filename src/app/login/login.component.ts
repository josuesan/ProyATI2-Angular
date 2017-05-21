import { Component, OnInit } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MsgService } from '../msg.service';
import { LocalStorageService } from '../localstorage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	public myForm: FormGroup; 
  	constructor(public fb: FormBuilder, public http: Http, public servicio: MsgService,public serv: LocalStorageService,private router: Router) { 
  		
  		this.myForm = this.fb.group({
	  	username: ["",Validators.required],
	  	password: ["",Validators.compose([Validators.required,Validators.minLength(6)])]
  		});

  	}

  	ngOnInit() {
  	}

  log () {
  	let formData = this.myForm.value;
  	var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (this.serv.get_local_storage()!= null) {
      headers.append( 'Authorization', this.serv.get_local_storage());
    }

  	this.http.post('http://localhost:5000/login', JSON.stringify(formData),{ headers: headers })      
  	.subscribe(data => {
  
            if (data.json().error == true){
                this.servicio.msgs = [];
                this.servicio.msgs.push({severity:'error', summary:'Error', detail:data.json().mensaje});
                setTimeout(() => {
                  this.servicio.msgs = [];}, 5000);
              }
              else{
                this.router.navigate(['/']);  
                this.servicio.msgs = [];
                this.servicio.msgs.push({severity:'success', summary:'', detail:data.json().mensaje});
                setTimeout(() => {
                this.servicio.msgs = [];
                
                }, 5000);
                var token = data.json().token;
                this.serv.set_local_storage(token);
                this.serv.set_username(formData.username);
              }       
      }, error => {
          console.log(error.json());
      });

  }

  
}
