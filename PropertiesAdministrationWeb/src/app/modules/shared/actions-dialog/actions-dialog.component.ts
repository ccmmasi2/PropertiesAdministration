import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '@app/services/event.service';

@Component({
  selector: 'app-actions-dialog',
  templateUrl: './actions-dialog.component.html'
})
export class ActionsDialogComponent implements OnInit {
  dataId!: number;
  hidePropertiesButton: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ActionsDialogComponent>,
    private eventService: EventService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    this.dataId = this.data.dataId;

    if (this.data.fromPropertyList) {
      this.hidePropertiesButton = true;  
    } else {
      this.hidePropertiesButton = false;  
    }

  }
 
  invokeWatchClickEvent() {
    this.eventService.emitWatchButtonClick(this.dataId);
    this.dialogRef.close(); 
  }
 
  invokeEditClickEvent() {
    this.eventService.emitEditButtonClick(this.dataId);
    this.dialogRef.close(); 
  }
 
  invokeDeleteClickEvent() {
    this.eventService.emitDeleteButtonClick(this.dataId);
    this.dialogRef.close(); 
  }
 
  invokeWatchPropertiesClickEvent() {
    this.eventService.emitWatchPropertiesButtonClick(this.dataId);
    this.dialogRef.close(); 
  }
}
