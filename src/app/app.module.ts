import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MessagesModule} from 'primeng/primeng';

import { AppComponent } from './app.component';
import { ProductsList } from './products-list.component';
import { ProductsForm } from './products-form.component';
import { Product } from './product-show.component';
import { ProductsEdit } from './products-edit.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { MsgService } from './msg.service';
import { LocalStorageService } from './localstorage.service';
import { PerfilComponent } from './perfil/perfil.component';
import { CommentComponent } from './comment/comment.component';
import { CartComponent } from './cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsList,
    ProductsForm,
    Product,
    ProductsEdit,
    LoginComponent,
    RegisterComponent,
    PerfilComponent,
    CommentComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    MessagesModule
  ],
  providers: [
      MsgService,
      LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
