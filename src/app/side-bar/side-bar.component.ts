import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
	faHome, faExpand, faCompress, faBars, faBookmark, faSearch,
	faHandPointDown, faHandPointUp, faHandPointLeft, faBookOpenReader, faHeadphonesSimple,
	faArrowTurnRight, faFloppyDisk, faXmark, faEraser, faFeatherPointed
} from '@fortawesome/free-solid-svg-icons';
import { SideBarService } from '../services/side_bar.service';
import { ReadServiceService } from '../services/read-service.service';
import { quranIndex } from 'src/app/data';
import { ProgressService } from '../services/progress.service';
import { LocalStorageService } from '../services/localStorage.service';
@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss']
})

export class SideBarComponent {
	goToPageValue = 0;
	itIsFirstTime = false;
	currentUrl: string = '/';
	showSurahList = false;
	showMark = false;
	showSearch = false;

	lastReadPage: number = 0;
	listeningData: { readerId: number, surahId: number } = { readerId: 1, surahId: 1 };
	tafseerData: {lecturerId: number, surahId: number, videoId: number } = {lecturerId: 1, surahId: 1, videoId: 0 }

	firstListeningTime = true;
	firstTafseerTime = true;

	showSavePopup = false;
	searchBySurah = true;
	doneReadingList: number[] = [];
	doneListeningList: number[] = [];

	quranIndex = quranIndex;
	quranIndexFiltered: any[] = ['filter', ...quranIndex];
	surahFilter: string = '';

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
	faSearch = faSearch;

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
			this.lastReadPage = currentPage;
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
		this.getTafseerData();

		this.doneListeningList = this.progress.getDoneListeningList();
		this.doneReadingList = this.progress.getDoneReadingList();
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

	getTafseerData() {
		const LastTafseerData = JSON.parse(localStorage.getItem('last_Tafseer_video') || '{}');
		console.log(LastTafseerData);
		if (LastTafseerData?.surahId && LastTafseerData?.mofasrId) {

			this.tafseerData = {
				surahId: LastTafseerData?.surahId,
				videoId: LastTafseerData?.videoId || 0,
				lecturerId: LastTafseerData?.mofasrId
			}

			this.firstTafseerTime = false;
		} else {
			this.firstTafseerTime = true;
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

	showAddMarkPopup() {
		this.showMark = !this.showMark;
	}

	showSearchPopup() {
		this.goToPageValue = this.lastReadPage;
		this.showSearch = !this.showSearch;
	}

	setSearchBySurah(searchBySurah: boolean) {
		this.searchBySurah = searchBySurah;
	}

	filterSurah() {
		if (!this.surahFilter)
			return this.quranIndexFiltered = ['filter', ...this.quranIndex];

		return this.quranIndexFiltered = ['filter', ...this.quranIndex.filter((surah: { name: string }) => surah.name.includes(this.surahFilter))];
	}

	closeAllPopUp() {
		this.showMark = false;
		this.showSearch = false;
		this.showSavePopup = false;
	}

	goTo() {
		if (this.goToPageValue > 604)
			this.goToPageValue = 604;

		this.read.scrollToPage(this.goToPageValue);
	}
}
