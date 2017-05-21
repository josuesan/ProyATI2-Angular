import { Component, OnInit } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { MsgService } from '../msg.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
	private products;
  private indiceInf = 0;
  private indiceSup = 6;
  constructor(public http: Http, public servicio: MsgService) {
		this.http.get('http://localhost:5000/listar_destacados')
			.subscribe(data => {
				if (data.json().error == true){
					this.servicio.msgs = [];
        	this.servicio.msgs.push({severity:'info', summary:'', detail:data.json().mensaje});
					this.products = [];
					setTimeout(() => {
    					this.servicio.msgs = []; }, 5000);
				}
				else{
					this.products = data.json();
          this.listFav(this.products,this.indiceInf,this.indiceSup);
					//console.log(this.products);
				}
      		}, error => {
          		console.log(error.json());
      		});
	}

	ngOnInit(){}
  
  ModificarIndices(indiceInf,indiceSup){
    this.indiceInf=indiceInf;
    this.indiceSup=indiceSup;
  }  

  listFav (productos,indiceInf,indiceSup){
    var tam = productos.length ;
    var i;
    //console.log(productos);
    if (tam <= indiceInf) {
      window.scrollTo(0,0);
      this.servicio.msgs = [];
      this.servicio.msgs.push({severity:'info', summary:'', detail:'No hay más productos disponibles en esta sección.'});
      setTimeout(() => {
      this.servicio.msgs = []; }, 5000);
    }
    if (tam < indiceSup) {
      indiceSup = tam;
    }
    for (i = indiceInf; i < indiceSup; i++) {
      //console.log("producto con ventas de :"+productos[i].sell);
      var fila = $('<div/>', {
        'class' : 'col-sm-6 col-md-6 col-lg-4',
        'id'    : 'Fila_' + i
      });

      $(".destacado").append(fila);

      var panelTotal = $('<div/>', {
        'class' : 'panel panel-default panelProduct',
        'id'    : 'panel-id_' + i
      });

      $("#Fila_"+i).append(panelTotal);

      var panelHead = $('<div/>', {
        'class' : 'panel-heading',
        'id'    : 'panelhead-id_' + i
      });
      var panelbody = $('<div/>', {
        'class' : 'panel-body',
        'id'    : 'panelbody-id_' + i
      });
      var panelfooter = $('<div/>', {
        'class' : 'panel-footer',
        'id'    : 'panelfooter-id_' + i
      });

      $("#panel-id_"+i).append(panelHead);
      $("#panel-id_"+i).append(panelbody);
      $("#panel-id_"+i).append(panelfooter);

      panelHead = $("<h4></h4>").text(productos[i].name);
      $("#panelhead-id_"+i).append(panelHead);
          
      // agregar imagen al panel body
      panelbody = $('<img/>', {
        'class' : 'img-responsive',
        'id'    : 'image_' + i,
        'src'   : productos[i].img
      });
      $("#panelbody-id_"+i).append(panelbody);

      var precio = $("<p></p>").text("Precio: "+productos[i].price+"Bs");
      $("#panelfooter-id_"+i).append(precio);

      panelfooter = $('<a/>', {
        'href'    : '/producto/' + productos[i].id,
        'class'   : 'btn btn-default'
      });
      panelfooter.text("Ver mas");
      $("#panelfooter-id_"+i).append(panelfooter);

    }
    //indiceSup = indiceSup +5;
    this.ModificarIndices(indiceSup,indiceSup+6);    
  };
}
