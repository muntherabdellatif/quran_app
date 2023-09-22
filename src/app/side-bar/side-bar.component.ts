import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { faHome, faExpand, faCompress, faBars, faBookmark, faHandPointDown, faHandPointUp, faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import { SideBarService } from '../services/side_bar.service';
import { ReadServiceService } from '../services/read-service.service';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  itIsFirstTime = false;
  currentUrl: string = '/';
  showBigSurah = true;
  showSmallSurah = true;
  showSurahList = false;

  faExpand = faExpand;
  faCompress = faCompress;
  faHome = faHome;
  faBars = faBars;
  faBookmark = faBookmark;
  pointer = faHandPointDown;

  constructor(
    private router: Router,
    private sideBar: SideBarService,
    private read: ReadServiceService,
    private el: ElementRef,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url;
      }
    });
    this.read.currentPage.subscribe((currentPage => {
      this.checkPointerDirection(currentPage);
    }))
  }

  toggleShowBigSurah() {
    this.sideBar.toggleShowBigSurah();
    this.showBigSurah = this.sideBar.getShowBigSurah();
  }

  toggleShowSurahList() {
    this.sideBar.toggleShowSurahList();
    this.showSurahList = this.sideBar.getShowSurahList();
  }

  addMarkHer() {
    const currentPageId = this.read.getCurrentPageId();
    this.read.addMark(currentPageId);
  }

  goToMark() {
    this.read.scrollToPage();
  }

  checkPointerDirection(currentPageId: number) {
    const markId = this.read.getMarkPageId();
    if (markId == currentPageId)
      this.pointer = faHandPointLeft;
    else if (markId > currentPageId)
      this.pointer = faHandPointDown;
    else
      this.pointer = faHandPointUp;
  }

  isQuranPages(url: string) {
    return url.split('/')[1] == 'quran_pages';
  }
}
