import { Component, HostListener } from '@angular/core';
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
  bookMark = {scrollY: 0, id: 0}

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.bookMark = JSON.parse(localStorage.getItem("bookMark") || '');
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.surahId = +id;
        this.text = this.quranText[+id - 1].ar;
        this.surahName = this.quranText[+id - 1].name;
        this.checkPointerDirection();
      }
    })
  }

  @HostListener('window:scroll', ['$event'])
  checkPointerDirection(): void {
    console.log("id : " , this.surahId , "bookMark.id :", this.bookMark.id);

    if (this.surahId == this.bookMark.id && Math.abs(window.scrollY - this.bookMark.scrollY) < 500)
      this.pointer = faHandPointLeft;
    else if (window.scrollY > this.bookMark.scrollY && this.surahId == this.bookMark.id || this.surahId > this.bookMark.id)
      this.pointer = faHandPointUp;
    else
      this.pointer = faHandPointDown;
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
    this.pointer = faHandPointLeft;
  }

  goToMark() {
    this.bookMark = JSON.parse(localStorage.getItem("bookMark") || '');
    if (this.bookMark?.scrollY && this.bookMark?.id) {
      this.router.navigate(['/surah_read', this.bookMark?.id]);
      window.scrollTo({ top: this.bookMark?.scrollY, behavior: 'smooth'});
      this.pointer = faHandPointLeft;
    }
  }
}
