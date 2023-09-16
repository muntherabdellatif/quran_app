import { Component } from '@angular/core';
import { readers } from '../data/readers';
import { ActivatedRoute, Router } from '@angular/router';
import { faAnglesRight, faAnglesLeft, faBackward, faHome, faBookmark, faHandPointDown, faHandPointUp, faHandPointLeft} from '@fortawesome/free-solid-svg-icons';

interface SurahLink {
  id: number,
  name: string,
  link_id: string
}

interface Reader {
  reader_id: number,
  reader_name: string,
  quran: SurahLink[]
}
@Component({
  selector: 'app-surah-listening-page',
  templateUrl: './surah-listening-page.component.html',
  styleUrls: ['./surah-listening-page.component.scss']
})
export class SurahListeningPageComponent {
  readers: Reader[] = readers;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

    ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log(id);
      }
    })
  }

}
