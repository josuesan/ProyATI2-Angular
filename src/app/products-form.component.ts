import { Component, ViewChild, AfterViewInit} from '@angular/core';
import { Http, Headers} from '@angular/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ProductsList }  from './products-list.component';
import { MsgService } from './msg.service';
import { LocalStorageService } from './localstorage.service';
import {Router} from '@angular/router';



declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products.css']

})

export class ProductsForm implements AfterViewInit{
  private ide: number;
  public myForm: FormGroup;

  /*@ViewChild(ProductsList)
  private PL: ProductsList;*/

  ngAfterViewInit() {
    if (this.serv.get_local_storage() == null){
      this.servicio.msgs = [];
      this.servicio.msgs.push({severity:'error', summary:'Acceso denegado', detail:'Debes iniciar sesión'});
      this.router.navigate(['./login']);
      setTimeout(() => {
      this.servicio.msgs = []; }, 5000);
                
     }
  }
  constructor(public fb: FormBuilder, public http: Http, public servicio: MsgService, public serv: LocalStorageService, private router: Router) {
      this.myForm = this.fb.group({
          name: ["",Validators.required],
          price: ["",Validators.required],
          description: ["",Validators.required],
          img: ["",Validators.required],
          sell: ["",Validators.required],
          category: ["",Validators.required]
      });
  }

  new () {
  	let formData = this.myForm.value;
  	var headers = new Headers();
    headers.append('Content-Type', 'application/json');
      if (this.serv.get_local_storage()!= null) {
          headers.append( 'Authorization', this.serv.get_local_storage());
          headers.append( 'username', this.serv.get_username());
      }

  	this.http.post('http://localhost:5000/crear', JSON.stringify(formData),{ headers: headers })      
  	.subscribe(data => {
            this.router.navigate(['./productos']);
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
}


