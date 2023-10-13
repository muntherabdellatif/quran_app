import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReadServiceService } from '../services/read-service.service';
import { quranIndex } from '../data';
import { LocalStorageService } from '../services/localStorage.service';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-quran-pages',
	templateUrl: './quran-pages.component.html',
	styleUrls: ['./quran-pages.component.scss']
})
export class QuranPagesComponent {
	@Input('pageIdNumber') pageIdNumber = 1;
	@Input('inListening') inListening: boolean = false;

	pageId = "001";
	pagesNumber: any[] = Array.from({ length: 604 }, (_, index) => index + 1);
	lastScrollPosition: number = 0;
	quranIndex = quranIndex;
	pagesSurahEndArray: any = Array.from({ length: 605 }, (_, index) => []);
	currentPages = ['001', '002', '003', '004', '005'];
	markId = 0;

	faBookmark = faBookmark;

	constructor(
		private route: ActivatedRoute,
		private el: ElementRef,
		private read: ReadServiceService,
		private localStorage: LocalStorageService
	) {
		this.pagesNumber.forEach(n => {
			this.pagesNumber[n - 1] = String(this.pagesNumber[n - 1]).padStart(3, '0')
		});

		quranIndex.forEach((surah, index) => {
			const nextSurah = quranIndex[index + 1];
			if (nextSurah) {
				let nextSurahPage = 0;
				if (nextSurah.page - Math.floor(nextSurah.page) == 0)
					nextSurahPage = nextSurah.page - 1;
				else
					nextSurahPage = Math.floor(nextSurah.page);

				this.pagesSurahEndArray[nextSurahPage - 1].push(surah.id);
			}
		});
	}

	ngOnInit() {
		this.route.paramMap.subscribe((params: any) => {
			const id = params.get('id');
			if (id) {
				if (!this.inListening)
					this.pageIdNumber = +id - 1;

				this.updateCurrentPages(this.inListening ? this.pageIdNumber : +id);
				this.pageId = this.pagesNumber[this.pageIdNumber];
				this.scrollToPage(this.pageId);
			}
		});
		this.read.scroll.subscribe((id: any) => {
			this.pageIdNumber = +id - 1;
			this.updateCurrentPages(+id);
			this.pageId = this.pagesNumber[this.pageIdNumber];
			this.scrollToPage(this.pageId);
		})
		this.read.mark.subscribe((id: any) => {
			this.markId = id;
		})

		this.markId = this.read.getMarkPageId();
	}

	@HostListener('window:scroll', ['$event'])
	updateCurrentPage(): void {
		const pagesList: any = this.getElementsList();
		const currentPage = this.checkElementsVisibility(pagesList);
		this.updateCurrentPages(currentPage);
	}

	getElementsList() {
		const pagesList: any = [];
		this.currentPages.forEach(pageId => {
			const imageElement = this.el.nativeElement.querySelector(`#page-${pageId}`);
			pagesList.push(imageElement)
		})
		return pagesList;
	}

	checkElementsVisibility(pagesList: any[]) {
		const viewportTop = window.scrollY;
		const viewportBottom = viewportTop + window.innerHeight;
		let currentPage = 0
		for (const page of pagesList) {
			const rect = page.getBoundingClientRect();
			const elementTop = rect.top + viewportTop;
			const elementBottom = elementTop + rect.height;

			if (elementTop <= viewportBottom && elementBottom >= viewportTop) {
				const id = (page.id).split('page-')[1];
				currentPage = +id;
			}
		}
		return currentPage;
	}

	scrollToPage(pageId: string) {
		setTimeout(() => {
			const imageElement = this.el.nativeElement.querySelector(`#page-${pageId}`);
			if (imageElement) {
				imageElement.scrollIntoView({ behavior: 'instant' });
			}
		}, 800);
	}

	doneReading(surahId: number) {
		this.localStorage.doneReading(surahId);
	}

	deleteButton(index: number, surahId: number) {
		const indexToDelete = this.pagesSurahEndArray[index].indexOf(surahId);
		if (indexToDelete !== -1) {
			this.pagesSurahEndArray[index].splice(indexToDelete, 1);
		}
	}

	updateCurrentPages(currentPage: number) {
		const pagesIds = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
			.filter(id => id > 0).filter(id => id < 605);

		const currentPages: string[] = [];
		pagesIds.forEach(id => {
			currentPages.push(this.pagesNumber[id - 1])
		});
		this.currentPages = currentPages;
		this.read.setCurrentPageId(currentPage);
	}
}
