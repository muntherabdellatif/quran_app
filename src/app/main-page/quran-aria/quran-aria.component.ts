import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { quranIndex, smallQuranIndex } from 'src/app/data';
import { SideBarService } from 'src/app/services/side_bar.service';
import { faBookOpenReader, faHeadphonesSimple, faSearch } from '@fortawesome/free-solid-svg-icons';
import { LightService } from 'src/app/services/light.service';

@Component({
	selector: 'app-quran-aria',
	templateUrl: './quran-aria.component.html',
	styleUrls: ['./quran-aria.component.scss']
})
export class QuranAriaComponent {
  mobileSize = 426;
	readonly slanderedPageWidth = 1400;
	@Input() width: number = this.slanderedPageWidth;
	@Input() height: number = this.slanderedPageWidth;
	@Input() quranAriaWidthSubject: Subject<number> | undefined;
  @Input() quranAriaHeightSubject: Subject<number> | undefined;
  @ViewChild('search_field') searchField: ElementRef | undefined;

	searchKey: string = "";

	faBookOpenReader = faBookOpenReader;
	faHeadphonesSimple = faHeadphonesSimple;
	faSearch = faSearch;
	showSearch = false;

	showBig: boolean = true;
	showList: boolean = false;
	readerId: number = 0;

	quranIndex = quranIndex;
	smallQuranIndex = smallQuranIndex;
	lightArray: number[] = [];
	filteredQuranIndex = quranIndex;

	constructor(private sideBarService: SideBarService, private light: LightService) { }

	ngOnInit() {
		this.showList = this.sideBarService.getShowSurahList();
		this.showBig = this.sideBarService.getShowBigSurah();

		this.quranAriaWidthSubject && this.quranAriaWidthSubject.subscribe((value: any) => {
			this.width = value;
			this.findSurahWidth();
		});

    this.quranAriaHeightSubject && this.quranAriaHeightSubject.subscribe((value: any) => {
			this.height = value;
			this.findSurahWidth();
		});

		this.sideBarService.surahList.subscribe((value: any) => {
			this.showList = value;
		});

		this.sideBarService.showBig.subscribe((value: any) => {
			this.showBig = value;
			this.findSurahWidth();
		});

		this.findSurahWidth();
		this.findSurahLight();
		this.getDefaultReader();
	}

	findSurahWidth() {
    const isMobile = this.width < this.mobileSize;
    const space  = isMobile ? this.height/1.6 : this.width;
		if (this.showBig) {
			this.quranIndex = quranIndex;
			this.quranIndex.forEach((surah, index) => {
				const nextSurah = this.quranIndex[index + 1];
				if (nextSurah)
					this.quranIndex[index].width = ((Math.sqrt(nextSurah.page - surah.page)) * 39 * space) / this.slanderedPageWidth * 0.98;
				this.quranIndex[index].x = (this.quranIndex[index].xIndex * space / this.slanderedPageWidth + 0.02 * space) * 0.98;
				this.quranIndex[index].y = (this.quranIndex[index].yIndex * space / this.slanderedPageWidth + 0.002 * space) * 0.98;
        if (isMobile) {
          const temp = this.quranIndex[index].x;
          this.quranIndex[index].x = this.quranIndex[index].y;
				  this.quranIndex[index].y = temp;
        }
			})
		} else {
			this.smallQuranIndex = smallQuranIndex;
			this.smallQuranIndex.forEach((surah, index) => {
				const nextSurah = this.smallQuranIndex[index + 1];
				if (nextSurah)
					this.smallQuranIndex[index].width = (Math.sqrt(nextSurah.page - surah.page) * 80 * space) * 1.33 / this.slanderedPageWidth;
				this.smallQuranIndex[index].x = (this.smallQuranIndex[index].xIndex * space / this.slanderedPageWidth - 0.18 * space) * 1.46;
				this.smallQuranIndex[index].y = (this.smallQuranIndex[index].yIndex * space / this.slanderedPageWidth - 0.03 * space) * 1.46;
        if (isMobile) {
          const temp = this.smallQuranIndex[index].x;
          this.smallQuranIndex[index].x = this.smallQuranIndex[index].y;
				  this.smallQuranIndex[index].y = temp;
        }
			})
		}
	}

	getDefaultReader() {
		let readerId = JSON.parse(localStorage.getItem("readerId") || "0");
		if (!readerId) {
			localStorage.setItem("readerId", "1");
			readerId = 1;
		}
		this.readerId = readerId;
	}


	findSurahLight() {
		const quranLightArray = this.light.getQuranLightArray();
		this.quranIndex.forEach((surah, index) => {
			this.lightArray.push(quranLightArray[index]);
		});
	}

	toggelShowSearch() {
		this.showSearch = !this.showSearch;
    if (this.showSearch)
      setTimeout(() => this.searchField && this.searchField.nativeElement.focus(),);
	}

	search() {
		if (!this.searchKey || this.searchKey == '') {
			this.quranIndex = quranIndex;
			this.smallQuranIndex = smallQuranIndex;
			return;
		}

		this.quranIndex = quranIndex.filter(surah => surah.name.includes(this.searchKey));
		this.smallQuranIndex = smallQuranIndex.filter(surah => surah.name.includes(this.searchKey));
	}

  splitSearchResult(array: any) {
    if (array.length > 114)
      array.pop();
    return [array.slice(0, array.length/2), array.slice(array.length/2, array.length)]
  }

  getFloor(number: number) {
    return Math.floor(number);
  }
}
