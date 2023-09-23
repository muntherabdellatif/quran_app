import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadServiceService {
  scroll: Subject<number> = new Subject();
  currentPage: Subject<number> = new Subject();
  currentPageId = 0;
  markId = 0;

  constructor() {
    this.markId = JSON.parse(localStorage.getItem("bookMarkPage") || '0');
  }

  getCurrentPageId(): number {
    return this.currentPageId;
  }

  setCurrentPageId(page_id: number) {
    this.currentPageId = page_id;
    this.currentPage.next(this.currentPageId);
    this.setLastPageLocalStorage(this.currentPageId);
  }

  addMark(page_id: number) {
    this.markId = page_id
    localStorage.setItem("bookMarkPage", JSON.stringify(page_id));
    this.currentPage.next(this.currentPageId);
  }

  getMarkPageId(): number {
    return JSON.parse(localStorage.getItem("bookMarkPage") || '0');
  }

  scrollToPage() {
    this.scroll.next(this.markId);
  }

  setLastPageLocalStorage(page: number) {
    localStorage.setItem('last-read-page', String(page));
  }
}
