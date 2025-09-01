import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OwnerDTO } from '@app/models/owner.model';
import { PropertyDTO } from '@app/models/property.model';

@Component({
  selector: 'app-owner-form',
  templateUrl: './owner-form.component.html'
})
export class OwnerFormComponent implements OnInit {
  isCollapsed: boolean = true;
  
  @ViewChild('propertyyForm') propertiesForm!: NgForm; 
  cartItems: PropertyDTO[] = []; 
  
  formByEmployee: boolean = false;
  employeeIdByURL: number = 0;
  ownerURLInformation: string = '';
  isSearchOwnerTermDisabled: boolean = false;
  
  searchOwnerTerm: string = '';
  beneficiaryId: number = 0;
  selectEmployeeId: number = 0;
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
    this.eventService.watchButtonClick.subscribe((beneficiaryId: number) => {
      this.loadBeneficiary(beneficiaryId);
      this.beneficiaryId = 0;
      this.activateSubmitButton = false;
    });
    this.eventService.editButtonClick.subscribe((beneficiaryId: number) => {
      this.loadBeneficiary(beneficiaryId);
      this.beneficiaryId = beneficiaryId;
      this.activateSubmitButton = true;      
    });
    this.eventService.deleteButtonClick.subscribe((beneficiaryId: number) => {
      this.deleteBeneficiary(beneficiaryId);
    });
  }
  
  ngOnInit(): void {
    this.formByEmployee = false;
    this.ownerURLInformation = '';
    this.isSearchOwnerTermDisabled = false;
    
    this.route.params.subscribe(params => {
      if(params["employeeId"]) {
        this.loadFormWithEmployeeUrl(params["employeeId"]);
      } 
    });
    
    this.loadDataOptions(); 
  }   
  
  loadFormWithEmployeeUrl(employeeId: number){
    this.formByEmployee = true;
    this.employeeIdByURL = employeeId;
    
    this.apiConnectionService.getEmployeeXId(this.employeeIdByURL)
    .subscribe({
      next: (employee) => {
        if (employee) {
          this.ownerURLInformation = 'del Empleado: ' + employee.name + ' ' + employee.identification;
          this.selectOwner(employee);
          this.isSearchOwnerTermDisabled = true;
        } else {
          this.ownerURLInformation = 'Empleado no encontrado';
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load employee:', error);
        this.ownerURLInformation = 'Error al cargar datos del empleado';
      }
    });
  }
  
  loadBeneficiary(beneficiaryId: number){
    this.apiConnectionService.getBeneficiaryXId(beneficiaryId)
    .subscribe((beneficiary) => { 
      beneficiary.birthDay = new Date(beneficiary.birthDay).toISOString().split('T')[0];  
      this.propertiesForm.reset(beneficiary);
      this.selectIdentificationType = beneficiary.countryId;
      this.isCollapsed = false; 
      
      if(this.employeeIdByURL && this.employeeIdByURL > 0) {
        this.loadEmployee(beneficiary.employeeId);
      }
    });
  } 
  
  loadEmployee(employeeId: number){
    this.apiConnectionService.getEmployeeXId(employeeId)
    .subscribe((employee) => { 
      this.selectOwner(employee);
    });
  }
  
  deleteBeneficiary(beneficiaryId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiConnectionService.deleteBeneficiary(beneficiaryId).subscribe(
          (response) => { 
            this.alertService.showAlert(response, 'success');
            this.refreshBeneficiaryList();
          },
          (error) => {
            this.alertService.showAlert(`Error eliminando el beneficiario: ${error.message || error}`, 'error');
          }
        );
      }
    });
  }
  
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;   
  }
  
  loadDataOptions(): void {
    this.apiConnectionService.getCountries().subscribe((info) => {
      if(info){
        this.identificationTypeOptions = info;
      }
      else {
        const message = `Error cargando paises`
        this.alertService.showAlert(message, 'error'); 
      }
    },
    (error) => {
      const message = `Error cargando paises: "${error}"`
      this.alertService.showAlert(message, 'error'); 
    }) 
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
        const message = `El beneficiario debe tener al menos 18 años`
        this.alertService.showAlert(message, 'error'); 
        this.isCollapsed = true;
        return;
      }
      else {
        if(this.beneficiaryId > 0) {
          const beneficiaryRequest: BeneficiaryDTO = this.prepareBeneficiaryDTO();
          beneficiaryRequest.id = this.beneficiaryId;
          
          this.apiConnectionService.updateBeneficiary(beneficiaryRequest).subscribe({
            next: (message) => {
              this.alertService.showAlert(message, 'success');
              this.resetForm();
              this.isCollapsed = true;
              this.refreshBeneficiaryList();
            },
            error: (error) => {
              const message = `Error al crear el beneficiario: ${error.message || error}`;
              this.alertService.showAlert(message, 'error');
              this.isCollapsed = false;
            }
          });
        }
        else {
          const beneficiaryRequest: BeneficiaryDTO = this.prepareBeneficiaryDTO();
          
          this.apiConnectionService.createBeneficiary(beneficiaryRequest).subscribe({
            next: () => {
              const message = 'Beneficiario creado';
              this.alertService.showAlert(message, 'success');
              this.resetForm();
              this.isCollapsed = true;
              this.refreshBeneficiaryList();
            },
            error: (error) => {
              const message = `Error al crear el beneficiario: ${error.message || error}`;
              this.alertService.showAlert(message, 'error');
              this.isCollapsed = true;
            }
          });
        } 
      } 
    }  else {
      this.alertService.showAlert('Por favor llene los campos requeridos.', 'error');
      this.isCollapsed = true;
    }
  }
  
  refreshBeneficiaryList() {
    if(this.employeeIdByURL && this.employeeIdByURL > 0) {
      this.reactiveSharedService.getBeneficiariesByEmployeeId(this.employeeIdByURL);
    }
    else {
      this.reactiveSharedService.getBeneficiaries();
    }
  } 
  
  private prepareBeneficiaryDTO(): BeneficiaryDTO {
    const employeeRequest: BeneficiaryDTO = {
      id: 0,
      employeeId: this.selectEmployeeId,
      countryId: this.selectIdentificationType, 
      participationPercentaje: this.participationPercentaje,
      name: this.name,
      identification: this.identification, 
      birthDay: this.birthDay,
      curp: this.curp,
      ssn: this.ssn,
      phoneNumber: this.phoneNumber,
      countryName: '', 
      employeeName: '',
      employeeNumber: 0
    }
    
    return employeeRequest;
  }
  
  public resetForm(): void {
    if(this.employeeIdByURL && this.employeeIdByURL > 0) {
      this.loadFormWithEmployeeUrl(this.employeeIdByURL);
    }
    else {
      this.selectEmployeeId = 0;
    }

    this.beneficiaryId = 0;
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
      this.apiConnectionService.getEmployeesXFilter(this.searchOwnerTerm)
      .subscribe(results => {
        this.ownerResults = results;
      }, error => {
        console.error('Failed to load employees:', error);
        this.alertService.showAlert('Error cargando empleados: ' + error.message, 'error');
      });
    } else {
      this.ownerResults = [];  
    }
  }
  
  selectOwner(employee: OwnerDTO): void {
    this.selectEmployeeId = employee.id;
    this.searchOwnerTerm = `${employee.name} (${employee.id})`;   
    this.ownerResults = [];   
  }
  
  clearResults(): void {
    setTimeout(() => {   
      this.ownerResults = [];
    }, 200);
  }
  
  validateParticipationTotal(): void {
    if (this.selectEmployeeId) {
      this.apiConnectionService.validateTotalParticipation(this.selectEmployeeId, this.participationPercentaje)
      .subscribe({
        next: (isValid) => {
          if (!isValid) {
            this.alertService.showAlert('La suma total de los porcentajes de participación excede el 100%', 'error');
            this.isCollapsed = true;
          }
        },
        error: (error) => {
          console.error('Error al validar la suma de participación', error);
          this.alertService.showAlert('Error al validar la suma de participación', 'error');
        }
      });
    }
  }
}
