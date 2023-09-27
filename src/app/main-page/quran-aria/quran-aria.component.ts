import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { quranIndex, smallQuranIndex } from 'src/app/data';
import { SideBarService } from 'src/app/services/side_bar.service';
import { faBookOpenReader, faHeadphonesSimple } from '@fortawesome/free-solid-svg-icons';
import { LightService } from 'src/app/services/light.service';

@Component({
  selector: 'app-quran-aria',
  templateUrl: './quran-aria.component.html',
  styleUrls: ['./quran-aria.component.scss']
})
export class QuranAriaComponent {
  readonly slanderedPageWidth = 1400;
  @Input() width: number = this.slanderedPageWidth;
  @Input() quranAriaWidthSubject: Subject<number> | undefined;

  faBookOpenReader = faBookOpenReader;
  faHeadphonesSimple = faHeadphonesSimple;

  showBig: boolean = true;
  showList: boolean = false;
  readerId: number = 0;

  quranIndex = quranIndex;
  smallQuranIndex = smallQuranIndex;
  lightArray: number[] = [];

  constructor(private sideBarService: SideBarService, private light: LightService){}

  ngOnInit() {
    this.showList = this.sideBarService.getShowSurahList();
    this.showBig = this.sideBarService.getShowBigSurah();

    this.quranAriaWidthSubject && this.quranAriaWidthSubject.subscribe(value => {
      this.width = value;
      this.findSurahWidth();
    });

    this.sideBarService.surahList.subscribe(value => {
      this.showList = value;
    });

    this.sideBarService.showBig.subscribe(value => {
      this.showBig = value;
      this.findSurahWidth();
    });

    this.findSurahWidth();
    this.findSurahLight();
    this.getDefaultReader();
  }

  findSurahWidth() {
    if (this.showBig) {
      this.quranIndex = quranIndex;
      this.quranIndex.forEach((surah,index) => {
        const nextSurah = this.quranIndex[index + 1];
        if (nextSurah)
          this.quranIndex[index].width = ((Math.sqrt(nextSurah.page - surah.page)) * 40 * this.width) / this.slanderedPageWidth * 0.98 ;
          this.quranIndex[index].x = (this.quranIndex[index].xIndex * this.width / this.slanderedPageWidth + 0.02 * this.width) * 0.98 ;
          this.quranIndex[index].y = (this.quranIndex[index].yIndex * this.width / this.slanderedPageWidth + 0.002 * this.width) * 0.98 ;
      })
    } else {
      this.smallQuranIndex = smallQuranIndex;
      this.smallQuranIndex.forEach((surah,index) => {
        const nextSurah = this.smallQuranIndex[index + 1];
        if (nextSurah)
          this.smallQuranIndex[index].width = (Math.sqrt(nextSurah.page - surah.page) * 80 * this.width) * 1.33 / this.slanderedPageWidth;
          this.smallQuranIndex[index].x = (this.smallQuranIndex[index].xIndex * this.width / this.slanderedPageWidth - 0.18 * this.width)*1.46;
          this.smallQuranIndex[index].y = (this.smallQuranIndex[index].yIndex * this.width / this.slanderedPageWidth - 0.03 * this.width)*1.46;
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
    this.quranIndex.forEach((surah,index) => {
      this.lightArray.push(quranLightArray[index]);
    });
    console.log(this.lightArray);
  }
}
