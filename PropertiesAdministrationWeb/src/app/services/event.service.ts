import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  watchButtonClick: EventEmitter<number> = new EventEmitter<number>();
  editButtonClick: EventEmitter<number> = new EventEmitter<number>();
  deleteButtonClick: EventEmitter<number> = new EventEmitter<number>();
  watchBeneficiariesButtonClick: EventEmitter<number> = new EventEmitter<number>();

  emitWatchButtonClick(employeeId: number) {
    this.watchButtonClick.emit(employeeId);
  }

  emitEditButtonClick(employeeId: number) {
    this.editButtonClick.emit(employeeId);
  }

  emitDeleteButtonClick(employeeId: number) {
    this.deleteButtonClick.emit(employeeId);
  }

  emitWatchBeneficiariesButtonClick(employeeId: number) {
    this.watchBeneficiariesButtonClick.emit(employeeId);
  }
}
