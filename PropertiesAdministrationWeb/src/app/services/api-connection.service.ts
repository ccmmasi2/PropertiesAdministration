import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OwnerDTO } from '../models/owner.model';
import { PropertyDTO } from '../models/property.model';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiConnectionService {
  private baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) {}
  
  getOwners(
    page: number,
    sizePage: number,
    sorting: string
  ): Observable<{ totalRecords: number, currentPage: number, sizePage: number, sorting: number, data: OwnerDTO[] }> {
    let url = `${this.baseUrl}/api/Owner?page=${page}&sizePage=${sizePage}`;
    
    if(sorting) {
      url += `&sorting=${sorting}`;
    }
    
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        return {
          currentPage: response.page,
          sizePage: response.pageSize,
          sorting: response.sorting,
          totalRecords: response.totalCount,
          data: response.items
        };
      }),
      catchError((error: any) => {
        console.error('Error obteniendo propietarios:', error);
        return throwError(() => new Error('Error obteniendo propietarios'));
      })
    );
  } 
  
  createOwner(ownerRequest: OwnerDTO): Observable<OwnerDTO> {
    const url = `${this.baseUrl}/api/Owner`;
    return this.http.post<OwnerDTO>(url, ownerRequest).pipe(
      catchError((error: any) => {
        console.error('Error creando owner:', error);
        throw error;  
      })
    )
  } 
  
  updateOwner(ownerRequest: OwnerDTO): Observable<string> {
    return this.http.put(`${this.baseUrl}/api/Owner/Update`, ownerRequest, {
      observe: 'response',
      responseType: 'text' as 'json'
    })
    .pipe(
      map(response => {
        return 'Propietario actualizado correctamente';
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error al actualizar el propietario';
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
          if (error.status === 409) {  
            errorMessage = 'Error: La identificación del propietario ya existe.';
          }
        }
        return throwError(errorMessage);
      })
    );
  }
  
  deleteOwner(id: number): Observable<{ message: string }> {
    const url = `${this.baseUrl}/api/Owner/Delete/${id}`;
    return this.http.delete< {message: string }>(url).pipe(
       catchError(error => {
        const message = typeof error.error === 'string' ? error.error : error.error?.message || 'Ocurrió un error desconocido';
        return throwError(message); 
      })
    );
  }  
  
  getOwnerXId(ownerId: number): Observable<OwnerDTO> {
    const url = `${this.baseUrl}/api/Owner/${ownerId}`;
    return this.http.get<OwnerDTO>(url).pipe(
      catchError(error => {
        console.error('Error obteniendo el propietario:', error);
        return throwError(() => new Error('Error obteniendo el propietario por id'));
      })
    );
  }  
  
  getOwnersXFilter(searchTerm: string): Observable<OwnerDTO[]> {
    const url = `${this.baseUrl}/api/Owner/ObtAllXFilter?term=${searchTerm}`;
    return this.http.get<OwnerDTO[]>(url).pipe(
      catchError(error => {
        console.error('Error obteniendo empleados por filtro:', error);
        return throwError(() => new Error('Error obteniendo empleados por filtro'));
      })
    );
  }  
    
  getProperties(
    page: number,
    sizePage: number,
    sorting: string
  ): Observable<{ totalRecords: number, currentPage: number, sizePage: number, sorting: number, data: PropertyDTO[] }> {
    let url = `${this.baseUrl}/api/Property?page=${page}&sizePage=${sizePage}`;
    
    if(sorting) {
      url += `&sorting=${sorting}`;
    }
    
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        return {
          currentPage: response.page,
          sizePage: response.pageSize,
          sorting: response.sorting,
          totalRecords: response.totalCount,
          data: response.items
        };
      }),
      catchError((error: any) => {
        console.error('Error obteniendo propiedades:', error);
        return throwError(() => new Error('Error obteniendo propiedades'));
      })
    );
  } 
  
  getPropertiesByOwnerid(
    ownerId: number,
    page: number,
    sizePage: number,
    sorting: string
  ): Observable<{ totalRecords: number, currentPage: number, sizePage: number, sorting: number, data: PropertyDTO[] }> {
    let url = `${this.baseUrl}/api/Property/ObtAllXOwnerId?ownerId=${ownerId}&page=${page}&sizePage=${sizePage}`;
    
    if(sorting) {
      url += `&sorting=${sorting}`;
    }
    
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        return {
          currentPage: response.page,
          sizePage: response.pageSize,
          sorting: response.sorting,
          totalRecords: response.totalCount,
          data: response.data
        };
      }),
      catchError((error: any) => {
        console.error('Error obteniendo properties:', error);
        return throwError(() => new Error('Error obteniendo properties'));
      })
    );
  }  
  
  createProperty(propertyRequest: PropertyDTO): Observable<PropertyDTO> {
    const url = `${this.baseUrl}/api/Property`;
    return this.http.post<PropertyDTO>(url, propertyRequest).pipe(
      catchError((error: any) => {
        console.error('Error creando property:', error);
        throw error;  
      })
    )
  } 
  
  updateProperty(propertyRequest: PropertyDTO): Observable<string> {
    return this.http.put(`${this.baseUrl}/api/Property/Update`, propertyRequest, {
      observe: 'response',
      responseType: 'text' as 'json'
    })
    .pipe(
      map(response => {
        return 'Propiedad actualizada correctamente';
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error al actualizar la propiedad';
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
          if (error.status === 409) {  
            errorMessage = 'Error: el codigo interno de la propiedad ya existe.';
          }
        }
        return throwError(errorMessage);
      })
    );
  }
  
  deleteProperty(id: number): Observable<{ message: string }> {
    const url = `${this.baseUrl}/api/Property/Delete/${id}`;
    return this.http.delete< {message: string }>(url).pipe(
       catchError(error => {
        const message = typeof error.error === 'string' ? error.error : error.error?.message || 'Ocurrió un error desconocido';
        return throwError(message); 
      })
    );
  } 
  
  getPropertyXId(idProperty: number): Observable<PropertyDTO> {
    const url = `${this.baseUrl}/api/Property/${idProperty}`;
    return this.http.get<PropertyDTO>(url).pipe(
      catchError(error => {
        console.error('Error obteniendo la propiedad:', error);
        return throwError(() => new Error('Error obteniendo la propiedad por id'));
      })
    );
  }  
}
