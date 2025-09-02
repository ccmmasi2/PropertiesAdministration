import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OwnerDTO } from '@app/models/owner.model';
import { ActionsDialogComponent } from '@app/modules/shared/actions-dialog/actions-dialog.component';
import { AlertService } from '@app/services/alert-service.service';
import { ReactiveSharedService } from '@app/services/reactive-shared.service';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html'
})

export class OwnerListComponent implements OnInit {
  displayedColumns: string[] = [
    'idOwner',
    'identificationType',
    'identification',
    'name',
    'address',
    'birthDay',
    'actions'
  ];

  dataSource: MatTableDataSource<OwnerDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  length!: number;
  pageIndex: number = 0; 
  pageSizeLength: number = 10;
  sorting: string = '';
  pageSizeOptions = [10, 25, 50];

  constructor(
    private alertService: AlertService,
    public reactiveSharedService: ReactiveSharedService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource<OwnerDTO>();
   }

  ngOnInit(): void {
    this.refreshOwnerList(this.pageIndex, this.pageSizeLength, this.sorting);
    this.subscribeToData();
  }
 
  subscribeToData(): void { 
    this.reactiveSharedService.owners$.subscribe({
      next: data => {
        this.dataSource.data = data.data;
        this.length = data.totalRecords;
      },
      error: error => {
        this.alertService.showAlert(`Error loading owners: ${error}`, 'error');
      }
    }); 
  }

  refreshOwnerList(page: number, sizePage: number, sorting: string) {
    this.reactiveSharedService.getOwners(page + 1, sizePage, sorting);
  }  

  pageChanged(event: PageEvent) { 
    this.pageIndex = event.pageIndex;
    this.pageSizeLength = event.pageSize; 
    this.refreshOwnerList(this.pageIndex, this.pageSizeLength, this.sorting);
  }
  
  onSortChange(event: Sort): void {
    if (event.active && event.direction) {
      this.sorting = `${event.active} ${event.direction}`;
      this.refreshOwnerList(this.pageIndex, this.pageSizeLength, this.sorting);
    }
  } 

  openActionsDialog(event: MouseEvent, row: any) {
    const ownerObject: OwnerDTO = row as OwnerDTO;
    const offsetX = 240;
    const offsety = 35;
    this.dialog.open(ActionsDialogComponent, {
      data: { dataId: ownerObject.idOwner },
      position: {
        top: event.clientY - offsety + 'px',
        left: event.clientX - offsetX + 'px',
      },
    });
  }
}
