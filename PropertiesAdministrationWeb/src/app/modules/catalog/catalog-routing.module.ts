import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerFormComponent } from './owner-form/owner-form.component';
import { PropertyFormComponent } from './property-form/property-form.component';

const routes: Routes = [
  {
    path: 'system',
    children: [
      {
        path: 'owners',
        component: OwnerFormComponent,
      },
      {
        path: 'properties',
        component: PropertyFormComponent,
      },
      {
        path: 'system/owners/:ownerId',
        component: PropertyFormComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogRoutingModule { }
