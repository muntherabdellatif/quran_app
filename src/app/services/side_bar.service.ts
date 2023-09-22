import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  showBigSurah: boolean = true;
  showSurahList: boolean = false;

  showBig: Subject<boolean> = new Subject();
  surahList: Subject<boolean> = new Subject();

  constructor() { }

  getShowBigSurah() {
    return this.showBigSurah;
  }

  getShowSurahList() {
    return this.showSurahList;
  }

  toggleShowBigSurah() {
    this.showBigSurah = !this.showBigSurah;
    this.showBig.next(this.showBigSurah);
  }

  toggleShowSurahList() {
    this.showSurahList = !this.showSurahList;
    this.surahList.next(this.showSurahList);
  }
}
