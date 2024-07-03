import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUDProductosComponent } from './gestion_de_productos/crud-productos/crud-productos.component';


const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' }, 
  {path: 'productos', component: CRUDProductosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
