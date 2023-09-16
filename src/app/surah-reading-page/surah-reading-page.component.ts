import { Component } from '@angular/core';
import { quranText } from '../data/Quran';
import { ActivatedRoute, Router } from '@angular/router';
import { faAnglesRight, faAnglesLeft, faBackward, faHome, faBookmark, faHandPointDown, faHandPointUp, faHandPointLeft} from '@fortawesome/free-solid-svg-icons';

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
  faBookmark = faBookmark;
  pointer = faHandPointDown;

  readonly quranText = quranText;
  text: string = "";
  surahName: string = "";
  surahId = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
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

  addMarkHer() {
    const scrollY = window.scrollY;
    localStorage.setItem("bookMark", JSON.stringify({scrollY, id: this.surahId}));
  }

  goToMark() {
    const bookMark = JSON.parse(localStorage.getItem("bookMark") || '');
    if (bookMark?.scrollY && bookMark?.id) {
      this.router.navigate(['/surah_read', bookMark?.id]);
      window.scrollTo({ top: bookMark?.scrollY, behavior: 'instant'});
    }
  }
}
