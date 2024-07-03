import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '../app/app-routing.module';
import { AppComponent } from '../app/app.component';
import { CRUDProductosComponent } from '../app/gestion_de_productos/crud-productos/crud-productos.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from '../app/token.interceptor';
import { AuthService } from '../app/auth.service';
import { HomeComponent } from '../app/home/home.component';
import { RegistroComponent } from '../app/registro/registro.component';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from '../app/reset-password/reset-password.component';
import { CambiarPasswordComponent } from '../app/cambiar-password/cambiar-password.component';
import { PageNotFoundComponent } from '../app/page-not-found/page-not-found.component';
import { HeaderComponent } from '../app/shared/header/header.component';
import { CrearProductoComponent } from '../app/gestion_de_productos/crear-producto/crear-producto.component';
import { AsideComponent } from '../app/shared/aside/aside.component';
import { AuthGuard } from 'src/services/auth.guard';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { CrudUsuariosComponent } from 'src/app/gestion_de_usuarios/crud-usuarios/crud-usuarios.component';
import { CarritoComponent } from './carrito/carrito.component';
import { OrdenesClienteComponent } from './gestion_ordenes_cliente/ordenes-cliente/ordenes-cliente.component';
import { OrdenesClienteModalComponent } from './gestion_ordenes_cliente/ordenes-cliente-modal/ordenes-cliente-modal.component';
import { OrdenesNoAsignadasComponent } from './gestion_de_panadero/ordenes-no-asignadas/ordenes-no-asignadas.component';
import { InsumosComponent } from './insumos/insumos.component';
import { CrearInsumoComponent } from './insumos/crear-insumo/crear-insumo.component';
import { InsumosModalComponent } from './gestion_de_productos/insumos-modal/insumos-modal.component';
import { HomePanaderoComponent } from './gestion_de_panadero/home-panadero/home-panadero.component';
import { HomeClienteComponent } from './home-cliente/home-cliente.component';
import { PedidosOrdenModalComponent } from './gestion_de_panadero/pedidos-orden-modal/pedidos-orden-modal.component';
import { InsumosPedidoModalComponent } from './gestion_de_panadero/insumos-pedido-modal/insumos-pedido-modal.component';
import { InsumosTotalesModalComponent } from './gestion_de_panadero/insumos-totales-modal/insumos-totales-modal.component';
import { ConfirmDialogComponent } from './gestion_de_productos/confirm-dialog/confirm-dialog.component';
import { OrderByComponent } from 'src/services/order-by/order-by.component';
import { ModificarProductoComponent } from './gestion_de_productos/modificar-producto/modificar-producto.component';
import { InsumosTotalesAdminModalComponent } from './grstion_ordenes_admin/insumos-totales-admin-modal/insumos-totales-admin-modal.component';
import { ModalModificarComponent } from './insumos/modal-modificar/modal-modificar.component';
import { ModalOrdenesDetallesComponent } from './gestion_de_panadero/modal-ordenes-detalles/modal-ordenes-detalles.component';
import { ModalDetalleOrdenComponent } from './gestion_de_panadero/modal-detalle-orden/modal-detalle-orden.component';
import { ModalDetalleInsumosComponent } from './gestion_de_panadero/modal-detalle-insumos/modal-detalle-insumos.component';
import { OrdenesAdminComponent } from './grstion_ordenes_admin/ordenes-admin/ordenes-admin.component';
import { ModalDetalleInsumosTotalesComponent } from './gestion_de_panadero/modal-detalle-insumos-totales/modal-detalle-insumos-totales.component';
import { PedidosAdminModalComponent } from './grstion_ordenes_admin/pedidos-admin-modal/pedidos-admin-modal.component';
import { PerfilClienteComponent } from './home-cliente/perfil-cliente/perfil-cliente.component';
import { ModalInsumosTotalesComponent } from './grstion_ordenes_admin/modal-insumos-totales/modal-insumos-totales.component';
import { ModalCrearUserComponent } from './gestion_de_usuarios/crud-usuarios/modal-crear-user/modal-crear-user.component';
import { ModalModifUserComponent } from './gestion_de_usuarios/crud-usuarios/modal-modif-user/modal-modif-user.component';
import { ModalDetalleClienteComponent } from './gestion_ordenes_cliente/modal-detalle-cliente/modal-detalle-cliente.component';

@NgModule({
  declarations: [
    AppComponent,
    CRUDProductosComponent,
    LoginComponent,
    HomeComponent,
    RegistroComponent,
    ResetPasswordComponent,
    CambiarPasswordComponent,
    PageNotFoundComponent,
    HeaderComponent,
    CrearProductoComponent,
    ModificarProductoComponent,
    AsideComponent,
    FooterComponent,
    CrudUsuariosComponent,
    CarritoComponent,
    OrdenesClienteComponent,
    OrdenesClienteModalComponent,
    HomePanaderoComponent,
    HomeClienteComponent,
    OrdenesNoAsignadasComponent,
    PedidosOrdenModalComponent,
    InsumosPedidoModalComponent,
    OrdenesClienteModalComponent,
    HomePanaderoComponent,
    HomeClienteComponent,
    OrdenesNoAsignadasComponent,
    InsumosComponent,
    CrearInsumoComponent,
    InsumosModalComponent,
    InsumosTotalesModalComponent,
    ConfirmDialogComponent,
    OrderByComponent,
    InsumosTotalesAdminModalComponent,
    ModalModificarComponent,
    ModalOrdenesDetallesComponent,
    ModalDetalleOrdenComponent,
    ModalDetalleInsumosComponent,
    OrdenesAdminComponent,
    ModalDetalleInsumosTotalesComponent,
    PedidosAdminModalComponent,
    PerfilClienteComponent,
    ModalInsumosTotalesComponent,
    ModalCrearUserComponent,
    ModalModifUserComponent,
    ModalDetalleClienteComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'productos', component: CRUDProductosComponent },
      { path: 'insumos', component: InsumosComponent },
      { path: 'login', component: LoginComponent, },
      { path: 'carrito', component: CarritoComponent, },
      { path: 'ordenesCliente', component: OrdenesClienteComponent },
      { path: 'home-panadero', component: HomePanaderoComponent },
      { path: 'ordenes-sin-asignar', component: OrdenesNoAsignadasComponent },
      { path: 'home-panadero', component: HomePanaderoComponent },
      { path: 'ordenes-sin-asignar', component: OrdenesNoAsignadasComponent },
      { path: 'pedidos-orden/:id', component: PedidosOrdenModalComponent },
      { path: 'insumos-pedido/:id', component: InsumosPedidoModalComponent },
      { path: 'pedidosOrden/:id', component: OrdenesClienteModalComponent },
      { path: 'totalFiltro', component:  InsumosTotalesModalComponent},
      { path: 'total-insumo-admin', component:  InsumosTotalesAdminModalComponent},
      { path: 'ordenes-admin', component:  OrdenesAdminComponent},
      { path: 'usuarios', children: [
          { path: 'registro', component: RegistroComponent },
          { path: 'forgot-password', component: ResetPasswordComponent },
          { path: 'reset-password', component: CambiarPasswordComponent },
          { path: 'users', component: CrudUsuariosComponent },
          { path: 'perfil', component: PerfilClienteComponent, canActivate: [AuthGuard] },
        ]
      },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard], },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent },
      
    ]),
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }, AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
