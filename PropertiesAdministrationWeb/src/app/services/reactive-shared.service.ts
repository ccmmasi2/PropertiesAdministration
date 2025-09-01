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
  private employeesSource = new BehaviorSubject<{ 
    totalRecords: number, 
    data: OwnerDTO[] 
  }>({ totalRecords: 0, data: [] });
  employees$ = this.employeesSource.asObservable();
  
  private beneficiarySource = new BehaviorSubject<{
     totalRecords: number, 
     data: PropertyDTO[] 
    }>({ totalRecords: 0, data: [] });
  beneficiaries$ = this.beneficiarySource.asObservable();

  constructor(private apiService: ApiConnectionService) {}

  getEmployees(page: number = 1, sizePage: number = 10, sorting: string = ''): void {
    this.apiService.getOwners(page, sizePage, sorting).subscribe({
      next:  response => this.employeesSource.next({ 
        totalRecords: response.totalRecords, 
        data: response.data
      }),
      error: error => console.error('Error cargando empleados', error)
    });
  } 

  // getBeneficiaries(page: number = 1, sizePage: number = 10, sorting: string = ''): void {
  //   this.apiService.getProperties(page, sizePage, sorting).subscribe({
  //     next:  response => this.beneficiarySource.next({ 
  //       totalRecords: response.totalRecords, 
  //       data: response.data
  //      }),
  //     error: error => console.error('Error cargando beneficiarios', error)
  //   });
  // } 

  getBeneficiariesByEmployeeId(employeeId: number, page: number = 1, sizePage: number = 10, sorting: string = ''): void {
    this.apiService.getPropertiesByOwnerid(employeeId, page, sizePage, sorting).subscribe({
      next:  response => this.beneficiarySource.next({
          totalRecords: response.totalRecords,
          data: response.data 
        }),
      error: error => console.error('Error cargando beneficiarios', error)
    });
  }  
}