import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionsDialogComponent } from './actions-dialog/actions-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ShowMessageComponent } from './show-message/show-message.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material/material.module';

@NgModule({
  declarations: [
    ActionsDialogComponent,
    ConfirmDialogComponent,
    ShowMessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    ShowMessageComponent,
  ]
})

export class SharedModule { }
