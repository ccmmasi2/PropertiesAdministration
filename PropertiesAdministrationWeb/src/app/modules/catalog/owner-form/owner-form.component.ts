import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/modules/shared/confirm-dialog/confirm-dialog.component';
import { AlertService } from '@app/services/alert-service.service';
import { ApiConnectionService } from '@app/services/api-connection.service';
import { ReactiveSharedService } from '@app/services/reactive-shared.service';
import { EventService } from '@app/services/event.service';
import { Router } from '@angular/router';
import { OwnerDTO } from '@app/models/owner.model';
import { IdentificationType } from '@app/models/identificationType.model';

@Component({
  selector: 'app-owner-form',
  templateUrl: './owner-form.component.html'
})

export class OwnerFormComponent implements OnInit {
  isCollapsed: boolean = true;
 
  @ViewChild('ownerForm') ownerForm!: NgForm; 
  cartItems: OwnerDTO[] = []; 

  ownerId: number = 0;
  selectIdentificationType: string = '';
  identificationTypeOptions: { id: string; name: string }[] = [];
  identification: string = '';
  name: string = '';
  address: string = '';
  birthDay: string = '';
  activateSubmitButton: boolean = true;
  selectedPhoto?: File;
  photoUrl: string = ''; 
  
  constructor(
    public apiConnectionService: ApiConnectionService,
    private alertService: AlertService,
    public reactiveSharedService: ReactiveSharedService,
    private eventService: EventService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.eventService.watchButtonClick.subscribe((ownerId: number) => {
      this.loadOwner(ownerId);
      this.ownerId = 0;
      this.activateSubmitButton = false;
    });
    this.eventService.editButtonClick.subscribe((ownerId: number) => {
      this.loadOwner(ownerId);
      this.ownerId = ownerId;
      this.activateSubmitButton = true;      
    });
    this.eventService.deleteButtonClick.subscribe((ownerId: number) => {
      this.deleteOwner(ownerId);
    });
    this.eventService.watchPropertiesButtonClick.subscribe((ownerId: number) => {
      this.router.navigate(['system/properties/',  { ownerId: ownerId } ]);
    });
  }

  loadOwner(ownerId: number){
    this.resetForm();
    this.apiConnectionService.getOwnerXId(ownerId)
    .subscribe((owner) => { 
      owner.birthDay = new Date(owner.birthDay).toISOString().split('T')[0];  

      if (this.ownerForm) {
        this.ownerForm.reset(owner);
      }

      this.selectIdentificationType = owner.identificationType;
      this.photoUrl = owner.photo || ''
      this.isCollapsed = false; 
    });
  }  

  deleteOwner(ownerId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiConnectionService.deleteOwner(ownerId).subscribe(
          (response) => { 
            this.alertService.showAlert(response.message, 'success');
            this.refreshOwnerList();
          },
          (error) => {
            const message = error;
            this.alertService.showAlert(message, 'error');
          }
        );
      }
    });
  }

  ngOnInit(): void {
    this.loadDataOptions(); 
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;   
  }

  loadDataOptions(): void {
    this.identificationTypeOptions = [
      { id: '', name: '-- Seleccione --' },
      ...Object.values(IdentificationType).map(value => ({
        id: value,
        name: value
      }))
    ];
  }

  submitForm(): void {
    if (this.ownerForm.valid) {
      if(this.ownerId > 0) {
        const ownerRequest: OwnerDTO = this.prepareOwnerDTO();
        ownerRequest.idOwner = this.ownerId;

        this.apiConnectionService.updateOwner(ownerRequest).subscribe({
          next: (message) => {
            this.alertService.showAlert(message, 'success');
            this.resetForm();
            this.isCollapsed = true;
            this.refreshOwnerList();
          },
          error: (error) => {
            const message = `Error al actualizar el propietario: ${error.message || error}`;
            this.alertService.showAlert(message, 'error');
            this.isCollapsed = false;
          }
        });
      }
      else {
        const ownerRequest: OwnerDTO = this.prepareOwnerDTO();

        this.apiConnectionService.createOwner(ownerRequest, this.selectedPhoto).subscribe({
          next: () => {
            const message = 'Propietario creado';
            this.alertService.showAlert(message, 'success');
            this.resetForm();
            this.isCollapsed = true;
            this.refreshOwnerList();
          },
          error: (error) => {
            const message = `Error al crear el propietario: ${error.message || error}`;
            this.alertService.showAlert(message, 'error');
            this.isCollapsed = true;
          }
        });
      } 
    }  else {
      this.alertService.showAlert('Por favor llene los campos requeridos.', 'error');
      this.isCollapsed = true;
    }
  }
  
  refreshOwnerList() {
    this.reactiveSharedService.getOwners();
  } 
  
  private prepareOwnerDTO(): OwnerDTO {
    const ownerRequest: OwnerDTO = {
      idOwner: 0,
      identificationType: this.selectIdentificationType, 
      identification: this.identification,
      name: this.name,
      address: this.address, 
      birthDay: this.birthDay,
      photo: 'No image yet'
    }

    return ownerRequest;
  }

  public resetForm(): void {
    this.ownerId = 0;
    this.selectIdentificationType = '';
    this.identification = '';
    this.name = '';
    this.address = '';
    this.birthDay = null!;
    this.activateSubmitButton = true;      
    this.ownerForm.resetForm();
    this.photoUrl = '';
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedPhoto = event.target.files[0];
    }
  }
}
