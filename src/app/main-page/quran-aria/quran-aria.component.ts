import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { quranIndex, smallQuranIndex } from 'src/app/data';
@Component({
  selector: 'app-quran-aria',
  templateUrl: './quran-aria.component.html',
  styleUrls: ['./quran-aria.component.scss']
})
export class QuranAriaComponent {
  readonly slanderedPageWidth = 1400;
  @Input() width: number = this.slanderedPageWidth;
  @Input() quranAriaWidthSubject: Subject<number> | undefined;
  @Input() showSmallSurah: Subject<boolean> | undefined;
  showBig: boolean = true;
  @Input() showBigSurah: Subject<boolean> | undefined;
  showSmall: boolean = true;
  end: 144 | 57 = 144;

  quranIndex = quranIndex;
  smallQuranIndex = smallQuranIndex;

  ngOnInit() {
    this.quranAriaWidthSubject && this.quranAriaWidthSubject.subscribe(value => {
      this.width = value;
      this.findSurahWidth();
    });
    this.showBigSurah && this.showBigSurah.subscribe(value => {
      this.showBig = value;
      this.findSurahWidth();
    });
    this.showSmallSurah && this.showSmallSurah.subscribe(value => {
      this.showSmall = value;
      this.end = this.showSmall? 144 : 57;
      this.findSurahWidth();
    });
    this.findSurahWidth();
  }

  findSurahWidth() {
    //! for test
    this.showBig = false;
    if (this.showBig) {
      this.quranIndex = quranIndex.slice(0, this.end);
      this.quranIndex.forEach((surah,index) => {
        const nextSurah = this.quranIndex[index + 1];
        if (nextSurah)
          this.quranIndex[index].width = (Math.sqrt(nextSurah.page - surah.page) * 40 * this.width) / this.slanderedPageWidth;
          this.quranIndex[index].x = this.quranIndex[index].xIndex * this.width / this.slanderedPageWidth;
          this.quranIndex[index].y = this.quranIndex[index].yIndex * this.width / this.slanderedPageWidth;
      })
    } else if(this.showSmall) {
      this.smallQuranIndex = smallQuranIndex;
      this.smallQuranIndex.forEach((surah,index) => {
        const nextSurah = this.smallQuranIndex[index + 1];
        if (nextSurah)
          this.smallQuranIndex[index].width = (Math.sqrt(nextSurah.page - surah.page) * 80 * this.width) * 1.2 / this.slanderedPageWidth;
          this.smallQuranIndex[index].x = (this.smallQuranIndex[index].xIndex * this.width / this.slanderedPageWidth - 200)*1.35;
          this.smallQuranIndex[index].y = (this.smallQuranIndex[index].yIndex * this.width / this.slanderedPageWidth - 30)*1.35;
      })
    }
  }
}
