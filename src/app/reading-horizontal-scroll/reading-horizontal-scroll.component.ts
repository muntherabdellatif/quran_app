import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReadServiceService } from '../services/read-service.service';
import { quranIndex } from '../data';
import { LocalStorageService } from '../services/localStorage.service';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reading-horizontal-scroll',
  templateUrl: './reading-horizontal-scroll.component.html',
  styleUrls: ['./reading-horizontal-scroll.component.scss']
})
export class ReadingHorizontalScrollComponent {
	@Input('pageIdNumber') pageIdNumber = 1;
	@Input('inListening') inListening: boolean = false;

	pageId = "001";
	pagesNumber: any[] = Array.from({ length: 604 }, (_, index) => index + 1);
	lastScrollPosition: number = 0;
	quranIndex = quranIndex;
	pagesSurahEndArray: any = Array.from({ length: 605 }, (_, index) => []);
	currentPages: string[] = [];
  currentPage = 0;
	markId = 0;
	faBookmark = faBookmark;

  firstPage = 0;
  lastPage = 0;

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

  @HostListener('touchstart', ['$event'])
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
    let currentPage = 0
    for (const page of pagesList) {
      const rect = page.getBoundingClientRect();
      if (rect.left < 10 && rect.left > -10) {
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
    // add current page to pages list
    if (!this.currentPages.length) {
      this.currentPages.push(this.pagesNumber[currentPage - 1]);
    }

    // set the value of first page in the list
    if ((!this.firstPage || currentPage == this.firstPage ) && currentPage > 1) {
      this.firstPage = currentPage - 1;
      this.currentPages.unshift(this.pagesNumber[this.firstPage - 1]);
      console.log("this.currentPages :", this.currentPages);
    }

    // set the value of last page in the list
    if ((!this.lastPage || currentPage == this.lastPage) && currentPage < 604) {
      this.lastPage = currentPage + 1;
      this.currentPages.push(this.pagesNumber[this.lastPage - 1]);
      console.log("this.currentPages :", this.currentPages);
    }

		this.read.setCurrentPageId(currentPage);
	}
}
