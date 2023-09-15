import { Component } from '@angular/core';
import { quranText } from '../data/Quran';
import { ActivatedRoute } from '@angular/router';
import { faAnglesRight, faAnglesLeft, faBackward, faHome} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-surah-reading-page',
  templateUrl: './surah-reading-page.component.html',
  styleUrls: ['./surah-reading-page.component.scss']
})
export class SurahReadingPageComponent {
  faAnglesRight = faAnglesRight;
  faAnglesLeft = faAnglesLeft;
  faBackward = faBackward;
  faHome = faHome;

  readonly quranText = quranText;
  text: string = "";
  surahName: string = "";
  surahId = 0;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.surahId = +id;
        this.text = this.quranText[+id - 1].ar;
        this.surahName = this.quranText[+id - 1].name;
      }
    })
  }

  doneRead() {
    const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
    const lastReadTimeArray = JSON.parse(localStorage.getItem("lastReadingTime") || "[]");
    if (lastReadTimeArray.length > 0) {
      lastReadTimeArray[this.surahId - 1] = timestampInSeconds;
      localStorage.setItem("lastReadingTime", JSON.stringify(lastReadTimeArray));
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'instant'});
  }
}
