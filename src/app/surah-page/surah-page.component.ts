import { Component } from '@angular/core';
import { quranIndex } from '../data/index';
import { surahInfo } from '../data/info';
import { ActivatedRoute } from '@angular/router';
import { faBrain, faBookOpenReader, faAnglesRight, faAnglesLeft, faCircleCheck, faCircle} from '@fortawesome/free-solid-svg-icons';

interface Surah {
  id: number,
  name: string,
  light: number,
  type: string,
  aiahNumber: number,
  parts: number[],
  memorize: boolean,
  interpretation: boolean,
  subjects:  ({ subject: string; to: number;}| { subject: string; to: string;})[]
  lastReadingTime: number;
  lastListeningTime:number,
  surahText: string;
  startPage: number,
}

@Component({
  selector: 'app-surah-page',
  templateUrl: './surah-page.component.html',
  styleUrls: ['./surah-page.component.scss']
})
export class SurahPageComponent {
  faCircleCheck = faCircleCheck;
  faCircle = faCircle;
  faAnglesRight = faAnglesRight;
  faAnglesLeft = faAnglesLeft;
  faBrain = faBrain;
  faBookOpenReader = faBookOpenReader;

  surah: Surah = {
    id: 0,
    name: "",
    light: 100,
    type: "مكية",
    aiahNumber: 0,
    parts: [0],
    memorize: true,
    interpretation: true,
    subjects: [{subject: "", to: 1}],
    lastReadingTime: 0,
    lastListeningTime: 0,
    surahText: "",
    startPage: 0,
  };
  readonly surahInfo = surahInfo;
  readonly quranIndex = quranIndex;
  readerId: number = 0;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.surah.id = +id;
        this.surah.name = this.quranIndex[+id - 1].name;
        this.surah.light = this.quranIndex[+id - 1].light;
        this.surah.type = this.surahInfo[+id - 1].type;
        this.surah.aiahNumber = this.surahInfo[+id - 1].aiahNumber;
        this.surah.parts = this.surahInfo[+id - 1].parts;
        this.surah.subjects = this.surahInfo[+id - 1].subjects;
        this.surah.startPage = this.quranIndex[+id - 1].page;
        this.getLastReadTime();
        this.getLastListeningTime();
        this.getMemorizing();
        this.getInterpretation();
        this.getDefaultReader();
      }
    })
  }

  toggleSurahMemorize() {
    this.surah.memorize = !this.surah.memorize;
    const memorizeArray = JSON.parse(localStorage.getItem("memorizing") || "[]");
    if (memorizeArray.length > 0) {
      memorizeArray[this.surah.id - 1] = this.surah.memorize;
      localStorage.setItem("memorizing", JSON.stringify(memorizeArray));
    }
  }

  toggleSurahInterpretation () {
    this.surah.interpretation = !this.surah.interpretation;
    const interpretationArray = JSON.parse(localStorage.getItem("interpretation") || "[]");
    if (interpretationArray.length > 0) {
      interpretationArray[this.surah.id - 1] = this.surah.interpretation;
      localStorage.setItem("interpretation", JSON.stringify(interpretationArray));
    }
  }

  getLastReadTime() {
    const lastReadTimeArray = JSON.parse(localStorage.getItem("lastReadingTime") || "[]");
    if (lastReadTimeArray.length > 0) {
      this.surah.lastReadingTime = lastReadTimeArray[this.surah.id - 1];
    }
  }

  getLastListeningTime() {
    const lastListeningTimeArray = JSON.parse(localStorage.getItem("lastListeningTime") || "[]");
    if (lastListeningTimeArray.length > 0) {
      this.surah.lastListeningTime = lastListeningTimeArray[this.surah.id - 1];
    }
  }

  getMemorizing() {
    const memorizeArray = JSON.parse(localStorage.getItem("memorizing") || "[]");
    if (memorizeArray.length > 0) {
      this.surah.memorize = memorizeArray[this.surah.id - 1];
    }
  }

  getInterpretation() {
    const interpretationArray = JSON.parse(localStorage.getItem("interpretation") || "[]");
    if (interpretationArray.length > 0) {
      this.surah.interpretation = interpretationArray[this.surah.id - 1];
    }
  }

  getDaysOfLastReadTime() {
    if (!this.surah.lastReadingTime)
      return 1;

    const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
    return Math.floor((timestampInSeconds - this.surah.lastReadingTime)/(60 * 60 * 24));
  }

  getDaysOfLastListeningTime() {
    if (!this.surah.lastListeningTime)
      return 1;

    const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
    return Math.floor((timestampInSeconds - this.surah.lastListeningTime)/(60 * 60 * 24));
  }

  doneRead() {
    const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
    const lastReadTimeArray = JSON.parse(localStorage.getItem("lastReadingTime") || "[]");
    if (lastReadTimeArray.length > 0) {
      lastReadTimeArray[this.surah.id - 1] = timestampInSeconds;
      localStorage.setItem("lastReadingTime", JSON.stringify(lastReadTimeArray));
      this.surah.lastReadingTime = timestampInSeconds;
    }
  }

  doneListening() {
    const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
    const lastListeningTimeArray = JSON.parse(localStorage.getItem("lastListeningTime") || "[]");
    if (lastListeningTimeArray.length > 0) {
      lastListeningTimeArray[this.surah.id - 1] = timestampInSeconds;
      localStorage.setItem("lastListeningTime", JSON.stringify(lastListeningTimeArray));
      this.surah.lastListeningTime = timestampInSeconds;
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
}
