import { Component } from '@angular/core';
import { quranText } from '../data/Quran';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-surah-reading-page',
  templateUrl: './surah-reading-page.component.html',
  styleUrls: ['./surah-reading-page.component.scss']
})
export class SurahReadingPageComponent {
  readonly quranText = quranText;
  text: string = "";

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.text = this.quranText[+id - 1].ar;
      }
    })
  }
}
