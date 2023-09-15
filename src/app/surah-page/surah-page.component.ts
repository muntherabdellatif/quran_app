import { Component } from '@angular/core';
import { quranIndex } from '../data/index';
import { surahInfo } from '../data/info';
import { ActivatedRoute } from '@angular/router';
import { faUpRightAndDownLeftFromCenter, faDownLeftAndUpRightToCenter, faCircleCheck, faCircle} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-surah-page',
  templateUrl: './surah-page.component.html',
  styleUrls: ['./surah-page.component.scss']
})
export class SurahPageComponent {
  faCircleCheck = faCircleCheck;
  faCircle = faCircle;

  surah = {
    name: "",
    light: 100,
    type: "مكية",
    aiahNumber: 0,
    parts: [0],
    memorize: true,
    interpretation: true,
  };
  readonly surahInfo = surahInfo;
  readonly quranIndex = quranIndex;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log(id);
      if (id) {
        this.surah.name = this.quranIndex[+id].name;
        this.surah.light = this.quranIndex[+id].light;
        this.surah.type = this.surahInfo[+id].type;
        this.surah.aiahNumber = this.surahInfo[+id].aiahNumber;
        this.surah.parts = this.surahInfo[+id].parts;
        console.log(this.surah);
      }
    })
  }

  toggleSurahMemorize() {

  }

  toggleSurahInterpretation () {

  }
}
