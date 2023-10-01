import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  showSurahList: boolean = false;

  surahList: Subject<boolean> = new Subject();

  constructor() { }

  getShowSurahList() {
    return this.showSurahList;
  }

  toggleShowSurahList() {
    this.showSurahList = !this.showSurahList;
    this.surahList.next(this.showSurahList);
  }
}
