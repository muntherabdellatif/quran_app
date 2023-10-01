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
  @ViewChild('search_field') searchField: ElementRef | undefined;

	searchKey: string = "";

	faBookOpenReader = faBookOpenReader;
	faHeadphonesSimple = faHeadphonesSimple;
	faSearch = faSearch;
	showSearch = false;

	showList: boolean = false;
	readerId: number = 0;

	quranIndex = quranIndex;
	smallQuranIndex = smallQuranIndex;
	lightArray: number[] = [];
	filteredQuranIndex = quranIndex;

	constructor(private sideBarService: SideBarService, private light: LightService) { }

	ngOnInit() {
		this.showList = this.sideBarService.getShowSurahList();

		this.sideBarService.surahList.subscribe((value: any) => {
			this.showList = value;
		});

		this.findSurahLight();
		this.getDefaultReader();
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
