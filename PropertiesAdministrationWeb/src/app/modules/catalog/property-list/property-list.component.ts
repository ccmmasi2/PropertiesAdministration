import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { PropertyDTO } from '@app/models/property.model';
import { ActionsDialogComponent } from '@app/modules/shared/actions-dialog/actions-dialog.component';
import { AlertService } from '@app/services/alert-service.service';
import { ReactiveSharedService } from '@app/services/reactive-shared.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html'
})

export class PropertyListComponent implements OnInit {
  
  ownerIdByURL: number = 0;

  displayedColumns: string[] = [
    'idProperty',
    'ownerName',
    'ownerIdentification',
    'name',
    'address',
    'price',
    'codeInternal',
    'year',
    'actions'
  ];
  dataSource: MatTableDataSource<PropertyDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  length!: number;
  pageIndex: number = 0; 
  pageSizeLength: number = 10;
  sorting: string = '';
  pageSizeOptions = [10, 25, 50];

  filterForm = this.fb.group({
    ownerNameOrId: [''],
    address: [''],
    codeInternal: [''],
    priceMin: [''],
    priceMax: [''],
    yearMin: [''],
    yearMax: ['']
  });

  constructor(
    private alertService: AlertService,
    public reactiveSharedService: ReactiveSharedService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<PropertyDTO>();
   }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params["ownerId"]) { 
        this.ownerIdByURL = params["ownerId"];
        this.refreshPropertiesListByOwnerId(params["ownerId"], this.pageIndex, this.pageSizeLength, this.sorting);
        this.subscribeToData();
      } 
      else {
        this.refreshPropertiesList(this.pageIndex, this.pageSizeLength, this.sorting);
        this.subscribeToData();
      }
    });
  }
 
  subscribeToData(): void { 
    this.reactiveSharedService.properties$.subscribe({
      next: data => {
        this.dataSource.data = data.data;
        this.length = data.totalRecords;
      },
      error: error => {
        this.alertService.showAlert(`Error loading properties: ${error}`, 'error');
      }
    }); 
  }

  refreshPropertiesListByOwnerId(ownerId: number, page: number, sizePage: number, sorting: string) {
    this.reactiveSharedService.getPropertiesByOwnerId(ownerId, page + 1, sizePage, sorting);
  } 

  refreshPropertiesList(page: number, sizePage: number, sorting: string) {
    this.reactiveSharedService.getProperties(page + 1, sizePage, sorting);
  }  

  pageChanged(event: PageEvent) { 
    this.pageIndex = event.pageIndex;
    this.pageSizeLength = event.pageSize; 

    if(this.ownerIdByURL && this.ownerIdByURL > 0){
      this.refreshPropertiesListByOwnerId(this.ownerIdByURL, this.pageIndex, this.pageSizeLength, this.sorting);
    }
    else{
      this.refreshPropertiesList(this.pageIndex, this.pageSizeLength, this.sorting);
    }
  }
  
  onSortChange(event: Sort): void {
    if (event.active && event.direction) {
      this.sorting = `${event.active} ${event.direction}`;
      
      if(this.ownerIdByURL && this.ownerIdByURL > 0){
        this.refreshPropertiesListByOwnerId(this.ownerIdByURL, this.pageIndex, this.pageSizeLength, this.sorting);
      }
      else{
        this.refreshPropertiesList(this.pageIndex, this.pageSizeLength, this.sorting);
      }
    }
  } 

  openActionsDialog(event: MouseEvent, row: any) {
    const propertyObject: PropertyDTO = row as PropertyDTO;
    const offsetX = 250;
    const offsety = 9;
    this.dialog.open(ActionsDialogComponent, {
      data: { 
        dataId: propertyObject.idProperty,
        fromPropertyList: true 
      },
      position: {
        top: event.clientY - offsety + 'px',
        left: event.clientX - offsetX + 'px',
      },
    });
  }

  resetFilters() {
    this.filterForm.reset();
    this.applyFilters();
  }

  applyFilters() {
    const filters = this.filterForm.value;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const f = JSON.parse(filter);

      return (!f.ownerNameOrId || data.ownerName.toLowerCase().includes(f.ownerNameOrId.toLowerCase()) 
              || data.idProperty.toString().includes(f.ownerNameOrId)) &&
            (!f.address || data.address.toLowerCase().includes(f.address.toLowerCase())) &&
            (!f.codeInternal || data.codeInternal.toLowerCase().includes(f.codeInternal.toLowerCase())) &&
            (!f.priceMin || data.price >= f.priceMin) &&
            (!f.priceMax || data.price <= f.priceMax) &&
            (!f.yearMin || data.year >= f.yearMin) &&
            (!f.yearMax || data.year <= f.yearMax);
    };

    this.dataSource.filter = JSON.stringify(filters);
  } 
}
