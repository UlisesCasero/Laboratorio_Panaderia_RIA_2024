import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, switchMap, throwError } from 'rxjs';
import { Producto } from 'src/models/producto';
import { ProductoCarrito } from 'src/models/productoCarrito';
import { Insumo, InsumoP } from 'src/models/insumo';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:3000';
  private apiUrl = 'http://localhost:3000/productos';
  private apiUrlInsumo = 'http://localhost:3000/insumos';
  private apiUrlProductoInsumo = 'http://localhost:3000/productoInsumo/';
  private apiUrlInsumos = 'http://localhost:3000/insumos/';
  getImageUrl(imageName: string): string {
    return `${this.baseUrl}/uploads/${imageName}`;
  }
  constructor(private http: HttpClient) { }
  
  eliminarInsumoDeProducto(idProducto: number, idInsumo: number): Observable<any> {
    const url = `${this.apiUrlProductoInsumo}/${idProducto}/${idInsumo}`;
    return this.http.delete(url);
  }

  getProductos(): Observable<Producto[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };

    return this.http.get<Producto[]>('http://localhost:3000/productos/', httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getProductosCarrito(): Observable<ProductoCarrito[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };

    return this.http.get<ProductoCarrito[]>('http://localhost:3000/productos/', httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getProducto(productoId: number): Observable<Producto> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };

    const url = `http://localhost:3000/productos/${productoId}`;
    return this.http.get<any>(url, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }
  private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dv9jvsqhr/image/upload'; // Reemplaza TU_CLOUD_NAME con tu nombre de cloud

  subirImagen(imagen: FormData): Observable<any> {
    const preset = 'dv9jvsqhr'; // Reemplaza TU_UPLOAD_PRESET con tu upload preset
    imagen.append('upload_preset', preset);
    return this.http.post<any>(this.cloudinaryUrl, imagen);
  }

  postProducto(producto: Producto): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };

    return this.http.post<any>(this.apiUrl, producto, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  delteProducto(productoId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };

    const url = `http://localhost:3000/productos/${productoId}`;
    return this.http.delete<any>(url, httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            return throwError(error.error.message || 'Error al eliminar el producto');
          } else {
            return throwError('Error del servidor');
          }
        })
      );
  }

  putProducto(productoModificado: Producto) {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };

    const url = `http://localhost:3000/productos/${productoModificado.id}`;
    return this.http.put<Producto>(url, productoModificado, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getInsumos2(): Observable<Insumo[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };
    // Suponiendo que la URL para obtener los insumos es '/api/insumos'
    return this.http.get<Insumo[]>('http://localhost:3000/insumos/', httpOptions)
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getInsumos(): Observable<Insumo> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };

    return this.http.get<Insumo>('http://localhost:3000/insumos/', httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getInsumoss(): Observable<Insumo[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      })
    };

    return this.http.get<Insumo[]>(this.apiUrlInsumo, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  postInsumo(producto: Insumo): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };

    return this.http.post<any>(this.apiUrlInsumo, producto, httpOptions)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  postProductoConInsumos(insumosSeleccionados: { idProducto: number, idInsumo: number, cantidad: number }[]): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
      })
    };

    const observables: Observable<any>[] = insumosSeleccionados.map(insumo => {
      const { idProducto, idInsumo, cantidad } = insumo;
      console.log(`Enviando: ID Producto ${idProducto}, ID Insumo ${idInsumo}, Cantidad ${cantidad}`);

      return this.http.post<any>(`${this.baseUrl}/productoInsumo/`, { idProducto, idInsumo, cantidad }, httpOptions).pipe(
        catchError(error => {
          console.error('Error al enviar insumo:', error);
          return throwError(error);
        })
      );
    });

    return forkJoin(observables);
  }
  getInsumosIdsByProductoId2(idProducto: number): Observable<InsumoP[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    const url = `${this.apiUrlProductoInsumo}${idProducto}`;
    return this.http.get<InsumoP[]>(url, httpOptions).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getInsumosForProductos(productos: any[]): Observable<InsumoP[][]> {
    const requests = productos.map(producto => this.getInsumosIdsByProductoId2(producto.id));
    return forkJoin(requests);
  }
  
  getInsumosIdsByProductoId(idProducto: number): Observable<number[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };
  
    const url = `${this.apiUrlProductoInsumo}${idProducto}`;
    return this.http.get<{ idInsumo: number }[]>(url, httpOptions).pipe(
      map(response => response.map(item => item.idInsumo)), // Extraer solo los idInsumo del arreglo de objetos
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  getInsumoPByIdProducto(idProducto: number): Observable<InsumoP[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    const url = `${this.apiUrlProductoInsumo}${idProducto}`;
    return this.http.get<{ idProducto: number, idInsumo: number, cantidad: number }[]>(url, httpOptions).pipe(
      map(response => {
        return response.map(item => new InsumoP(item.idInsumo, '', item.cantidad)); // Ajusta según tu modelo InsumoP
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  getDescripcionInsumoById(idInsumo: number): Observable<string> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No hay token almacenado');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      }),
    };

    const url = `${this.apiUrlInsumos}${idInsumo}`;
    return this.http.get<{ nombre: string }>(url, httpOptions).pipe(
      map((response) => response.nombre),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener la descripción del insumo:', error);
        return throwError('Error al obtener la descripción del insumo');
      })
    );
  }

  getInsumosYDescripciones(idProducto: number): Observable<{ id: number, nombre: string }[]> {
    return this.getInsumosIdsByProductoId(idProducto).pipe(
      switchMap((idsInsumos) => {
        const requests: Observable<string>[] = idsInsumos.map(id => this.getDescripcionInsumoById(id));
        return forkJoin(requests).pipe(
          map((descripciones: string[]) => {
            return idsInsumos.map((idInsumo, index) => ({ id: idInsumo, nombre: descripciones[index] }));
          }),
          catchError((error) => {
            return throwError(error);
          })
        );
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  deleteInsumo(insumoId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'bearer ' + localStorage.getItem('token')); 
    return this.http.delete<any>(`${this.apiUrlInsumos}${insumoId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  putInsumo(insumoId: number, insumo: Insumo): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token')); // Ajusta según tu método de autenticación
    return this.http.put<any>(`${this.apiUrlInsumos}${insumoId}`, insumo, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError('Error de la API. Por favor, inténtalo nuevamente más tarde.');
  }

  eliminarProductoInsumo(idProducto: number, idInsumo: number): Observable<any> {
    const url = `${this.apiUrlProductoInsumo}/${idProducto}/${idInsumo}`;
    const token = localStorage.getItem('token');
    
    if (!token) {
      return throwError('No hay token almacenado');
    }
    
    const headers = new HttpHeaders({
      'Authorization': `bearer ${token}`
    });
    
    return this.http.delete(url, { headers });
  }
}