import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { MsgService } from './msg.service';
import {Router} from '@angular/router';
@Injectable()
export class LocalStorageService {

  constructor(public http: Http, public servicio: MsgService,private router: Router) {}

  public get_no_exist_user(){
    if (localStorage.getItem('Session-Token') == null) {
      return true;
    }
    else{
      return false;
    }
  }
  public get_exist_user(){
    if (localStorage.getItem('Session-Token') == null) {
      return false;
    }
    else{
      return true;
    }
  }
  public get_local_storage(){
    return localStorage.getItem('Session-Token');
  }

  public get_username(){
    return localStorage.getItem('username');
  }

  public set_local_storage(token){
    localStorage.setItem('Session-Token', token);
    sessionStorage.setItem('Session-Token', token);
  }

  public set_username(username){
    localStorage.setItem('username', username);
    sessionStorage.setItem('username', username);  
  }

  public delete_username(){
    localStorage.removeItem('username');
    sessionStorage.removeItem('username');
  }


  public delete_local_storage(){
    localStorage.removeItem('Session-Token');
    sessionStorage.removeItem('Session-Token');
  }


  public logout (){
    var headers = new Headers();
    if (this.get_local_storage()!= null) {
      headers.append( 'Authorization', this.get_local_storage());
      headers.append( 'username', this.get_username());
    }

    this.http.get('http://localhost:5000/logout',{ headers: headers })      
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
                var token = data.json().token;
                this.delete_local_storage();
                this.delete_username();
              }       
      }, error => {
          console.log(error.json());
      });

  }

}