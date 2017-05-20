import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { LoginComponent }   from './login/login.component';
import { PerfilComponent }   from './perfil/perfil.component';
import { RegisterComponent } from './register/register.component';
import { ProductsList }  from './products-list.component';
import { ProductsForm }  from './products-form.component';
import { Product }  from './product-show.component';
import { ProductsEdit }  from './products-edit.component';
import { AppComponent }  from './app.component';
import { FeedComponent } from './feed/feed.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'productos', component: ProductsList },
  { path: 'producto/:id', component: Product },
  { path: 'perfil', component: PerfilComponent },
  { path: 'productos/agregar', component: ProductsForm },
  { path: 'producto/editar/:id', component: ProductsEdit },
  { path: 'home', component: AppComponent },
  { path: '', component: FeedComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}