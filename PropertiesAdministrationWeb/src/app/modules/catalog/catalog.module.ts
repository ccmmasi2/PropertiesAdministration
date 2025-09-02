import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerFormComponent } from './owner-form/owner-form.component';
import { OwnerListComponent } from './owner-list/owner-list.component';
import { PropertyFormComponent } from './property-form/property-form.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { CatalogRoutingModule } from './catalog-routing.module';
import { MaterialModule } from 'app/material/material.module';
import { FormsModule } from '@angular/forms';
import { NumericInputDirective } from '@app/rules/numeric-input.directive';

@NgModule({
  imports: [
    CommonModule,
    CatalogRoutingModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [
    OwnerFormComponent,
    OwnerListComponent, 
    PropertyFormComponent, 
    PropertyListComponent,
    NumericInputDirective 
  ]
})

export class CatalogModule { }
