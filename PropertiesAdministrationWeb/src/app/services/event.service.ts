import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  watchButtonClick: EventEmitter<number> = new EventEmitter<number>();
  editButtonClick: EventEmitter<number> = new EventEmitter<number>();
  deleteButtonClick: EventEmitter<number> = new EventEmitter<number>();
  watchPropertiesButtonClick: EventEmitter<number> = new EventEmitter<number>();

  emitWatchButtonClick(ownerId: number) {
    this.watchButtonClick.emit(ownerId);
  }

  emitEditButtonClick(ownerId: number) {
    this.editButtonClick.emit(ownerId);
  }

  emitDeleteButtonClick(ownerId: number) {
    this.deleteButtonClick.emit(ownerId);
  }

  emitWatchPropertiesButtonClick(ownerId: number) {
    this.watchPropertiesButtonClick.emit(ownerId);
  }
}
