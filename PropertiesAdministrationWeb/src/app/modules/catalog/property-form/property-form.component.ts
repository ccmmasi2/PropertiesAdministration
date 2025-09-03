import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OwnerDTO } from '@app/models/owner.model';
import { PropertyDTO } from '@app/models/property.model';
import { ConfirmDialogComponent } from '@app/modules/shared/confirm-dialog/confirm-dialog.component';
import { AlertService } from '@app/services/alert-service.service';
import { ApiConnectionService } from '@app/services/api-connection.service';
import { EventService } from '@app/services/event.service';
import { ReactiveSharedService } from '@app/services/reactive-shared.service';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html'
})

export class PropertyFormComponent implements OnInit {
  isCollapsed: boolean = true;
  
  @ViewChild('propertyForm') propertyForm!: NgForm; 
  cartItems: PropertyDTO[] = []; 
  
  formByOwner: boolean = false;
  ownerIdByURL: number = 0;
  ownerURLInformation: string = '';
  
  searchOwnerTerm: string = '';
  propertyId: number = 0;
  selectOwnerId: number = 0;
  ownerResults: OwnerDTO[] = []; 
  name: string = '';
  address: string = '';
  price: number = 0;
  codeInternal: string = '';
  year: number = 0;
  activateSubmitButton: boolean = true;
  photoUrl: string = ''; 
  propertyImagesList: { idPropertyImage: number, file: string, enable: boolean }[] = [];
  selectedPhoto?: File;
  canUploadImages: boolean = false;
  
  constructor(
    public apiConnectionService: ApiConnectionService,
    private alertService: AlertService,
    public reactiveSharedService: ReactiveSharedService,
    private eventService: EventService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.eventService.watchButtonClick.subscribe((propertyId: number) => {
      this.loadProperty(propertyId);
      this.propertyId = 0;
      this.activateSubmitButton = false;
    });
    this.eventService.editButtonClick.subscribe((propertyId: number) => {
      this.loadProperty(propertyId);
      this.propertyId = propertyId;
      this.activateSubmitButton = true;      
    });
    this.eventService.deleteButtonClick.subscribe((propertyId: number) => {
      this.deleteProperty(propertyId);
    });
  }
  
  ngOnInit(): void {
    this.formByOwner = false;
    this.ownerURLInformation = '';
    
    this.route.params.subscribe(params => {
      if(params["ownerId"]) {
        this.loadFormWithOwnerUrl(params["ownerId"]);
      } 
    });
  }   
  
  loadFormWithOwnerUrl(ownerId: number){
    this.formByOwner = true;
    this.ownerIdByURL = ownerId;
    
    this.apiConnectionService.getOwnerXId(this.ownerIdByURL)
    .subscribe({
      next: (owner) => {
        if (owner) {
          this.ownerURLInformation = 'del propietario: ' + owner.name;
          this.selectOwner(owner);
        } else {
          this.ownerURLInformation = 'Propietario no encontrado';
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load owner:', error);
        this.ownerURLInformation = 'Error al cargar datos del propietario';
      }
    });
  }
  
  loadProperty(propertyId: number){
    this.resetForm();
    this.apiConnectionService.getPropertyXId(propertyId)
    .subscribe((property) => { 
      this.propertyForm.reset(property);
      this.isCollapsed = false; 
      this.canUploadImages = true;
      
      this.photoUrl =  ''
      this.loadImages(property.idProperty);

      this.loadOwner(property.idOwner);
    });
  } 

  loadImages(idProperty: number) {
    this.apiConnectionService.getPropertyImagesXPropertyId(idProperty)
    .subscribe((images) => { 
      this.propertyImagesList = images.filter(img => img.enable);
    });
  }
  
  loadOwner(ownerId: number){
    this.apiConnectionService.getOwnerXId(ownerId)
    .subscribe((owner) => { 
      this.selectOwner(owner);
    });
  }
  
  deleteProperty(propertyId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiConnectionService.deleteProperty(propertyId).subscribe(
          (response) => { 
            this.alertService.showAlert(response.message, 'success');
            this.refreshPropertyList();
          },
          (error) => {
            const message = error;
            this.alertService.showAlert(message, 'error');
          }
        );
      }
    });
  }
  
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;   
  }   
  
  submitForm(): void {
    if (this.propertyForm.valid) {
       
        if(this.propertyId > 0) {
          const propertyRequest: PropertyDTO = this.preparePropertyDTO();
          propertyRequest.idProperty = this.propertyId;
          
          this.apiConnectionService.updateProperty(propertyRequest).subscribe({
            next: (message) => {
              this.alertService.showAlert(message, 'success');
              this.resetForm();
              this.isCollapsed = true;
              this.refreshPropertyList();
            },
            error: (error) => {
              const message = `Error al actualizar la propiedad: ${error.message || error}`;
              this.alertService.showAlert(message, 'error');
              this.isCollapsed = false;
            }
          });
        }
        else {
          const propertyRequest: PropertyDTO = this.preparePropertyDTO();
          
          this.apiConnectionService.createProperty(propertyRequest).subscribe({
            next: () => {
              const message = 'Propiedad creada';
              this.alertService.showAlert(message, 'success');
              this.resetForm();
              this.isCollapsed = true;
              this.refreshPropertyList();
            },
            error: (error) => {
              const message = `Error al crear la propiedad: ${error.message || error}`;
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
  
  refreshPropertyList() {
    if(this.ownerIdByURL && this.ownerIdByURL > 0) {
      this.reactiveSharedService.getPropertiesByOwnerId(this.ownerIdByURL);
    }
    else {
      this.reactiveSharedService.getProperties();
    }
  } 
  
  private preparePropertyDTO(): PropertyDTO {
    const propertyRequest: PropertyDTO = {
      idProperty: 0,
      idOwner: this.selectOwnerId,
      name: this.name,
      address: this.address, 
      codeInternal: this.codeInternal,
      price: this.price,
      year: this.year,
      ownerName: ''
    }
    
    return propertyRequest;
  }
  
  public resetForm(): void {
    if(this.ownerIdByURL && this.ownerIdByURL > 0) {
      this.loadFormWithOwnerUrl(this.ownerIdByURL);
    }
    else {
      this.selectOwnerId = 0;
    }

    this.propertyId = 0;
    this.name = '';
    this.address = '';
    this.year = 0;
    this.codeInternal = '';
    this.price = 0;
    this.selectOwnerId = 0;
    this.searchOwnerTerm= '';  
    this.activateSubmitButton = true;      
    this.propertyForm.resetForm();

    this.photoUrl = '';
    this.canUploadImages = false;
  }
  
  onSearchChange(): void {
    if (this.searchOwnerTerm && this.searchOwnerTerm.length > 0) {
      this.apiConnectionService.getOwnersXFilter(this.searchOwnerTerm)
      .subscribe(results => {
        this.ownerResults = results;
      }, error => {
        console.error('Failed to load owners:', error);
        this.alertService.showAlert('Error cargando propietarios: ' + error.message, 'error');
      });
    } else {
      this.ownerResults = [];  
    }
  }
  
  selectOwner(owner: OwnerDTO): void {
    this.selectOwnerId = owner.idOwner;
    this.searchOwnerTerm = `${owner.name} (${owner.idOwner})`;   
    this.ownerResults = [];   
  }
  
  clearResults(): void {
    setTimeout(() => {   
      this.ownerResults = [];
    }, 200);
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedPhoto = event.target.files[0];
    }
  }

  disableImage(idPropertyImage: number, idProperty: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiConnectionService.DisableImage(idPropertyImage).subscribe({
          next: (response) => {
            this.alertService.showAlert(response, 'success');

            this.loadImages(idProperty);
          },
          error: (error) => {
            const message = typeof error === 'string' ? error : error.message || 'Ocurrió un error';
            this.alertService.showAlert(message, 'error');
          }
        });
      }
    });
  }
  
  cargarImagen(){
    
  }
}

