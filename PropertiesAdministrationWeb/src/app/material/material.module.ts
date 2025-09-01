import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    // MatAutocompleteModule,
    // MatButtonModule,
    MatCardModule,
    // MatChipsModule,
    MatDialogModule,
    // MatFormFieldModule,
    // MatGridListModule,
    MatIconModule,
    // MatInputModule,
    // MatListModule,
    // MatProgressSpinnerModule,
    // MatSelectModule,
    // MatSidenavModule,
    // MatSnackBarModule,
    // MatToolbarModule,
    // MatTabsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    // MatMenuModule,
  ]
})

export class MaterialModule { }
