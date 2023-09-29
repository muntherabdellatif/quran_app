import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  startReadingSurahId = 0;
  startListeningSurahId = 0;

  doneReadingList: number[] = [];
  updateDoneReadingList: Subject<number[]> = new Subject();
  doneListeningList: number[] = [];
  updateDoneListeningList: Subject<number[]> = new Subject();

  showSavePopup = false;
  showSave: Subject<boolean> = new Subject();

  constructor() {
    this.doneListeningList = JSON.parse(localStorage.getItem("done-listening-list") || '[]');
    this.doneReadingList = JSON.parse(localStorage.getItem("done-reading-list") || '[]');
  }

  toggleSavePopup() {
    console.log("toggle service");
    this.showSavePopup = !this.showSavePopup;
    this.showSave.next(this.showSavePopup);
  }

  addToDoneListening(surahId: number) {
    if (this.doneListeningList.includes(surahId))
      return
    this.doneListeningList.push(surahId);
    localStorage.setItem("done-listening-list", JSON.stringify(this.doneListeningList));
    this.updateDoneListeningList.next(this.doneListeningList);
  }

  removeFromDoneListeningList(surahId: number) {
    const indexToDelete = this.doneListeningList.indexOf(surahId);
    if (indexToDelete !== -1) {
      this.doneListeningList.splice(indexToDelete, 1);
    }
    localStorage.setItem("done-listening-list", JSON.stringify(this.doneListeningList));
    this.updateDoneListeningList.next(this.doneListeningList);
  }

  addToDoneReading(surahId: number) {
    if (this.doneReadingList.includes(surahId))
      return
    this.doneReadingList.push(surahId);
    localStorage.setItem("done-Reading-list", JSON.stringify(this.doneReadingList));
    this.updateDoneReadingList.next(this.doneReadingList);
  }

  getDoneReadingList() {
    return this.doneReadingList;
  }

  getDoneListeningList() {
    return this.doneListeningList;
  }
}
