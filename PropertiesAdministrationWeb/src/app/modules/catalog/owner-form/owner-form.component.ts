import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OwnerDTO } from '@app/models/owner.model';
import { PropertyDTO } from '@app/models/property.model';
import { AlertService } from '@app/services/alert-service.service';
import { ApiConnectionService } from '@app/services/api-connection.service';
import { EventService } from '@app/services/event.service';
import { ReactiveSharedService } from '@app/services/reactive-shared.service';

@Component({
  selector: 'app-owner-form',
  templateUrl: './owner-form.component.html'
})
export class OwnerFormComponent implements OnInit {
  isCollapsed: boolean = true;
  
  @ViewChild('propertyyForm') propertiesForm!: NgForm; 
  cartItems: PropertyDTO[] = []; 
  
  formByOwner: boolean = false;
  idOwnerByURL: number = 0;
  ownerURLInformation: string = '';
  isSearchOwnerTermDisabled: boolean = false;
  
  searchOwnerTerm: string = '';
  idProperty: number = 0;
  selectIdOwner: number = 0;
  selectIdentificationType: number = 0;
  ownerResults: OwnerDTO[] = []; 
  name: string = '';
  identification: string = '';
  birthDay: string = '';
  phoneNumber: string = '';
  curp: string = '';
  ssn: string = '';
  participationPercentaje: number = 1;
  activateSubmitButton: boolean = true;
  
  constructor(
    public apiConnectionService: ApiConnectionService,
    private alertService: AlertService,
    public reactiveSharedService: ReactiveSharedService,
    private eventService: EventService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.eventService.watchButtonClick.subscribe((idProperty: number) => {
      this.loadProperties(idProperty);
      this.idProperty = 0;
      this.activateSubmitButton = false;
    });
    this.eventService.editButtonClick.subscribe((idProperty: number) => {
      this.loadProperties(idProperty);
      this.idProperty = idProperty;
      this.activateSubmitButton = true;      
    });
    this.eventService.deleteButtonClick.subscribe((idProperty: number) => {
      this.deleteBeneficiary(idProperty);
    });
  }
  
  ngOnInit(): void {
    this.formByOwner = false;
    this.ownerURLInformation = '';
    this.isSearchOwnerTermDisabled = false;
    
    this.route.params.subscribe(params => {
      if(params["idOwner"]) {
        this.loadFormWithOwnerUrl(params["idOwner"]);
      } 
    });
    
    this.loadDataOptions(); 
  }   
  
  loadFormWithOwnerUrl(idOwner: number){
    this.formByOwner = true;
    this.idOwnerByURL = idOwner;
    
    this.apiConnectionService.getOwnerXId(this.idOwnerByURL)
    .subscribe({
      next: (owner) => {
        if (owner) {
          this.ownerURLInformation = 'del owner: ' + owner.name + ' ' + owner.identification;
          this.selectOwner(owner);
          this.isSearchOwnerTermDisabled = true;
        } else {
          this.ownerURLInformation = 'owner no encontrado';
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load owner:', error);
        this.ownerURLInformation = 'Error al cargar datos del owner';
      }
    });
  }
  
  loadProperties(idProperty: number){
    this.apiConnectionService.getPropertyXId(idProperty)
    .subscribe((property) => { 
      // property.birthDay = new Date(property.birthDay).toISOString().split('T')[0];  
      // this.propertiesForm.reset(property);
      // this.selectIdentificationType = property.countryId;
      // this.isCollapsed = false; 
      
      if(this.idOwnerByURL && this.idOwnerByURL > 0) {
        this.loadOwner(property.idOwner);
      }
    });
  } 
  
  loadOwner(idOwner: number){
    this.apiConnectionService.getOwnerXId(idOwner)
    .subscribe((owner) => { 
      this.selectOwner(owner);
    });
  }
  
  deleteBeneficiary(idProperty: number) {
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   width: '250px'
    // });
    
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.apiConnectionService.deleteBeneficiary(idProperty).subscribe(
    //       (response) => { 
    //         this.alertService.showAlert(response, 'success');
    //         this.refreshBeneficiaryList();
    //       },
    //       (error) => {
    //         this.alertService.showAlert(`Error eliminando el property: ${error.message || error}`, 'error');
    //       }
    //     );
    //   }
    // });
  }
  
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;   
  }
  
  loadDataOptions(): void {
    // this.apiConnectionService.getCountries().subscribe((info) => {
    //   if(info){
    //     this.identificationTypeOptions = info;
    //   }
    //   else {
    //     const message = `Error cargando paises`
    //     this.alertService.showAlert(message, 'error'); 
    //   }
    // },
    // (error) => {
    //   const message = `Error cargando paises: "${error}"`
    //   this.alertService.showAlert(message, 'error'); 
    // }) 
  }  
  
  validateAge(birthDay: Date | string): boolean {
    if (typeof birthDay === 'string') {
      birthDay = new Date(birthDay);
    }
    
    if (!(birthDay instanceof Date) || isNaN(birthDay.getTime())) {
      return false;
    }
    
    const currentDate = new Date();
    const diff = currentDate.getTime() - birthDay.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age >= 18;
  }
  
  submitForm(): void {
    if (this.propertiesForm.valid) {
      if (!this.validateAge(this.birthDay)) {
        const message = `El property debe tener al menos 18 años`
        this.alertService.showAlert(message, 'error'); 
        this.isCollapsed = true;
        return;
      }
      else {
        if(this.idProperty > 0) {
          // const beneficiaryRequest: BeneficiaryDTO = this.prepareBeneficiaryDTO();
          // beneficiaryRequest.id = this.idProperty;
          
          // this.apiConnectionService.updateBeneficiary(beneficiaryRequest).subscribe({
          //   next: (message) => {
          //     this.alertService.showAlert(message, 'success');
          //     this.resetForm();
          //     this.isCollapsed = true;
          //     this.refreshBeneficiaryList();
          //   },
          //   error: (error) => {
          //     const message = `Error al crear el property: ${error.message || error}`;
          //     this.alertService.showAlert(message, 'error');
          //     this.isCollapsed = false;
          //   }
          // });
        }
        else {
          // const beneficiaryRequest: BeneficiaryDTO = this.prepareBeneficiaryDTO();
          
          // this.apiConnectionService.createBeneficiary(beneficiaryRequest).subscribe({
          //   next: () => {
          //     const message = 'Beneficiario creado';
          //     this.alertService.showAlert(message, 'success');
          //     this.resetForm();
          //     this.isCollapsed = true;
          //     this.refreshBeneficiaryList();
          //   },
          //   error: (error) => {
          //     const message = `Error al crear el property: ${error.message || error}`;
          //     this.alertService.showAlert(message, 'error');
          //     this.isCollapsed = true;
          //   }
          // });
        } 
      } 
    }  else {
      this.alertService.showAlert('Por favor llene los campos requeridos.', 'error');
      this.isCollapsed = true;
    }
  }
  
  refreshBeneficiaryList() {
    if(this.idOwnerByURL && this.idOwnerByURL > 0) {
      this.reactiveSharedService.getBeneficiariesByEmployeeId(this.idOwnerByURL);
    }
    else {
      // this.reactiveSharedService.getBeneficiaries();
    }
  } 
  
  // private prepareBeneficiaryDTO(): BeneficiaryDTO {
  //   const employeeRequest: BeneficiaryDTO = {
  //     id: 0,
  //     idOwner: this.selectIdOwner,
  //     countryId: this.selectIdentificationType, 
  //     participationPercentaje: this.participationPercentaje,
  //     name: this.name,
  //     identification: this.identification, 
  //     birthDay: this.birthDay,
  //     curp: this.curp,
  //     ssn: this.ssn,
  //     phoneNumber: this.phoneNumber,
  //     countryName: '', 
  //     employeeName: '',
  //     employeeNumber: 0
  //   }
    
  //   return employeeRequest;
  // }
  
  public resetForm(): void {
    if(this.idOwnerByURL && this.idOwnerByURL > 0) {
      this.loadFormWithOwnerUrl(this.idOwnerByURL);
    }
    else {
      this.selectIdOwner = 0;
    }

    this.idProperty = 0;
    this.selectIdentificationType = 0;
    this.name = '';
    this.identification = '';
    this.birthDay = null!;
    this.phoneNumber = '';
    this.curp = '';
    this.ssn = '';
    this.participationPercentaje = 1;
    this.activateSubmitButton = true;      
    this.propertiesForm.resetForm();
  }
  
  onSearchChange(): void {
    if (this.searchOwnerTerm && this.searchOwnerTerm.length > 0) {
      this.apiConnectionService.getOwnersXFilter(this.searchOwnerTerm)
      .subscribe(results => {
        this.ownerResults = results;
      }, error => {
        console.error('Failed to load owners:', error);
        this.alertService.showAlert('Error cargando propietario: ' + error.message, 'error');
      });
    } else {
      this.ownerResults = [];  
    }
  }
  
  selectOwner(owner: OwnerDTO): void {
    this.selectIdOwner = owner.idOwner;
    this.searchOwnerTerm = `${owner.name} (${owner.idOwner})`;   
    this.ownerResults = [];   
  }
  
  clearResults(): void {
    setTimeout(() => {   
      this.ownerResults = [];
    }, 200);
  }
}
