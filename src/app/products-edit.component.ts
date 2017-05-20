import { Component, ViewChild, AfterViewInit} from '@angular/core';
import { Http, Headers} from '@angular/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
//import { ProductsList }  from './products-list.component';
import { MsgService } from './msg.service';
import { LocalStorageService } from './localstorage.service';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';


declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products.css']

})

export class ProductsEdit implements AfterViewInit{
  private ide: number;
  id: number;
  private sub: any;
  
  public myForm: FormGroup;

  /*@ViewChild(ProductsList)
  private PL: ProductsList;*/

  constructor(public fb: FormBuilder, public http: Http, public servicio: MsgService, public serv: LocalStorageService, private route: ActivatedRoute, private router: Router) {
    this.myForm = this.fb.group({
          name: ["",Validators.required],
          price: ["",Validators.required],
          description: ["",Validators.required],
          img: ["",Validators.required],
          sell: ["",Validators.required],
          category: ["",Validators.required]
      });
  }

  ngAfterViewInit() {
    if (this.serv.get_local_storage()!= null) {
        this.sub = this.route.params.subscribe(params => {
          this.id = +params['id'];
        });
        var url = 'http://localhost:5000/listar/' + this.id;
        var headers = new Headers();
          if (this.serv.get_local_storage()!= null) {
              headers.append( 'Authorization', this.serv.get_local_storage());
              headers.append( 'username', this.serv.get_username());
          }

          this.http.get(url,{ headers: headers })
          .subscribe(data => {
              if(data.json().error == true){
                this.servicio.msgs = [];
                        this.servicio.msgs.push({severity:'error', summary:'', detail:data.json().mensaje});
                        setTimeout(() => {
                        this.servicio.msgs = []; }, 5000);
              }
              else
              {
                this.mostrar(data.json());
              }
          }, error => {
              console.log(error.json());
          }); 
     }
     else
     {
      this.servicio.msgs = [];
      this.servicio.msgs.push({severity:'error', summary:'Acceso denegado', detail:'Debes iniciar sesión'});
      this.router.navigate(['./login']);
      setTimeout(() => {
      this.servicio.msgs = []; }, 5000);
                
     }
  }
  

   edit (id) {
    let formData = this.myForm.value;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

     if (this.serv.get_local_storage()!= null) {
          headers.append( 'Authorization', this.serv.get_local_storage());
          headers.append( 'username', this.serv.get_username());
     }

    this.http.put('http://localhost:5000/editar/'+id, JSON.stringify(formData),{ headers: headers })      
    .subscribe(data => {
             if(data.json().error == true){
                this.servicio.msgs = [];
                this.servicio.msgs.push({severity:'error', summary:'', detail:data.json().mensaje});
                setTimeout(() => {
                this.servicio.msgs = []; }, 5000);
                
              }
              else
              {
                  this.router.navigate(['./producto/'+id]);
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

  mostrar(event){
      this.myForm.setValue({name:event.name,
        price:event.price,
        description:event.description,
        img:event.img,
        sell:event.sell,
        category:event.category
      });
      this.ide = event.id;

  }
}


