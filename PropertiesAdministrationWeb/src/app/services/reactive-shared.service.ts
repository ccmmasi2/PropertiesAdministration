import { Injectable } from '@angular/core';
import { ApiConnectionService } from './api-connection.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OwnerDTO } from '../models/owner.model';
import { PropertyDTO } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})

export class ReactiveSharedService {
  private ownersSource = new BehaviorSubject<{ 
    totalRecords: number, 
    data: OwnerDTO[] 
  }>({ totalRecords: 0, data: [] });
  owners$ = this.ownersSource.asObservable();
  
  private propertiesSource = new BehaviorSubject<{
     totalRecords: number, 
     data: PropertyDTO[] 
    }>({ totalRecords: 0, data: [] });
  properties$ = this.propertiesSource.asObservable();

  constructor(private apiService: ApiConnectionService) {}

  getOwners(page: number = 1, sizePage: number = 10, sorting: string = ''): void {
    this.apiService.getOwners(page, sizePage, sorting).subscribe({
      next:  response => this.ownersSource.next({ 
        totalRecords: response.totalRecords, 
        data: response.data
      }),
      error: error => console.error('Error cargando los propietarios', error)
    });
  } 

  getProperties(page: number = 1, sizePage: number = 10, sorting: string = ''): void {
    this.apiService.getProperties(page, sizePage, sorting).subscribe({
      next:  response => this.propertiesSource.next({ 
        totalRecords: response.totalRecords, 
        data: response.data
      }),
      error: error => console.error('Error cargando los propietarios', error)
    });
  }  

  getPropertiesByOwnerId(ownerId: number, page: number = 1, sizePage: number = 10, sorting: string = ''): void {
    this.apiService.getPropertiesByOwnerid(ownerId, page, sizePage, sorting).subscribe({
      next:  response => this.propertiesSource.next({
          totalRecords: response.totalRecords,
          data: response.data 
        }),
      error: error => console.error('Error cargando propiedades', error)
    });
  }  
}