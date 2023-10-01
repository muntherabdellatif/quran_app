import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
	faHome, faExpand, faCompress, faBars, faBookmark, faBrain,
	faHandPointDown, faHandPointUp, faHandPointLeft, faBookOpenReader, faHeadphonesSimple,
	faArrowTurnRight, faFloppyDisk, faXmark, faEraser, faFeatherPointed
} from '@fortawesome/free-solid-svg-icons';
import { SideBarService } from '../services/side_bar.service';
import { ReadServiceService } from '../services/read-service.service';
import { quranIndex } from 'src/app/data';
import { ProgressService } from '../services/progress.service';
import { surahInfo } from '../data/info';
import { LocalStorageService } from '../services/localStorage.service';
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
	listeningData: { readerId: number, surahId: number } = { readerId: 1, surahId: 1 };
	firstListeningTime = true;
	showSavePopup = false;
	doneReadingList: number[] = [];
	doneListeningList: number[] = [];
	quranIndex = quranIndex;

	faExpand = faExpand;
	faCompress = faCompress;
	faHome = faHome;
	faBars = faBars;
	faBookmark = faBookmark;
	pointer = faHandPointDown;
	faHeadphonesSimple = faHeadphonesSimple;
	faBookOpenReader = faBookOpenReader;
	faArrowTurnRight = faArrowTurnRight;
	faFloppyDisk = faFloppyDisk;
	faXmark = faXmark;
	faEraser = faEraser;
  faFeatherPointed = faFeatherPointed;
  faBrain = faBrain;

	constructor(
		private router: Router,
		private sideBar: SideBarService,
		private read: ReadServiceService,
		private el: ElementRef,
		private progress: ProgressService,
		public localStorageService: LocalStorageService,
	) {
		this.currentUrl = this.router.url;
	}

	ngOnInit() {
		this.router.events.subscribe((event: any) => {
			if (event instanceof NavigationEnd) {
				this.currentUrl = this.router.url;
			}
		});
		this.read.currentPage.subscribe((currentPage: any) => {
			this.checkPointerDirection(currentPage);
		})
		this.progress.showSave.subscribe((showPopup: any) => {
			this.showSavePopup = showPopup;
		})
		this.progress.updateDoneReadingList.subscribe((doneReadingList: any) => {
			this.doneReadingList = doneReadingList;
		})
		this.progress.updateDoneListeningList.subscribe((doneListeningList: any) => {
			this.doneListeningList = doneListeningList;
		})
		this.getLastReadPage();
		this.getLastListeningData();
		this.doneListeningList = this.progress.getDoneListeningList();
		this.doneReadingList = this.progress.getDoneReadingList();

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
			this.listeningData = { readerId: this.getDefaultReader(), surahId: 1 };
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
		} else if (this.isListeningPage(this.currentUrl)) {
			this.getLastListeningData();
			return this.listeningData.surahId;
		}
		return 0;
	}

	toggleSaveProgressPopup() {
		this.progress.toggleSavePopup();
	}

	removeFromDoneListeningList(surahIds: number | number[]) {
		if (!Array.isArray(surahIds))
			surahIds = [surahIds];

		for (const id of surahIds)
			this.progress.removeFromDoneListeningList(id)
	}

	doneListeningAllList() {
		this.localStorageService.doneListening(this.doneListeningList);
		this.removeFromDoneListeningList([...this.doneListeningList]);
		this.progress.toggleSavePopup();
	}

  getFloor(number: number) {
    return Math.floor(number);
  }
}
