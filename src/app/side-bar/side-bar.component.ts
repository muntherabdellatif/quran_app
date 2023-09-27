import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { faHome, faExpand, faCompress, faBars, faBookmark, faHandPointDown, faHandPointUp, faHandPointLeft, faBookOpenReader, faHeadphonesSimple, faArrowTurnRight} from '@fortawesome/free-solid-svg-icons';
import { SideBarService } from '../services/side_bar.service';
import { ReadServiceService } from '../services/read-service.service';
import { quranIndex } from 'src/app/data';

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
	lastReadPage: number = 0;
  listeningData: {readerId: number, surahId:number} = {readerId: 1, surahId:1};
	firstListeningTime = true;
  quranIndex = quranIndex;

  faExpand = faExpand;
  faCompress = faCompress;
  faHome = faHome;
  faBars = faBars;
  faBookmark = faBookmark;
  pointer = faHandPointDown;
  faHeadphonesSimple =faHeadphonesSimple;
  faBookOpenReader = faBookOpenReader;
  faArrowTurnRight = faArrowTurnRight;

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
  	this.getLastReadPage();
    this.getLastListeningData();
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

  isListeningPage(url: string) {
    return url.split('/')[1] == 'surah_listening';
  }

  getLastReadPage() {
		this.lastReadPage = +(localStorage.getItem('last-read-page') || '');
	}

  getLastListeningData() {
		const LastListeningData = JSON.parse(localStorage.getItem('last_listening') || '{}');
		if (LastListeningData?.surahId && LastListeningData?.readerId) {
			this.listeningData.surahId = LastListeningData?.surahId;
			this.listeningData.readerId = LastListeningData?.readerId;
			this.firstListeningTime = false;
		} else {
      this.listeningData = {readerId: this.getDefaultReader(), surahId: 1};
      this.firstListeningTime = true;
		}
	}

  getDefaultReader() {
    let readerId = JSON.parse(localStorage.getItem("readerId") || "0");
    if (!readerId) {
      localStorage.setItem("readerId", "1");
      readerId = 1;
    }
    return readerId;
  }

  getBackSurahId() {
    if (this.isQuranPages(this.currentUrl)) {
      return this.read.getCurrentPageId();
    } else if (this.isListeningPage(this.currentUrl)){
      this.getLastListeningData();
      return this.listeningData.surahId;
    }
    return 0;
  }
}
