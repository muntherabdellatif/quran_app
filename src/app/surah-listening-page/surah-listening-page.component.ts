import { Component, ViewChild } from '@angular/core';
import { readers } from '../data/readers';
import { ActivatedRoute, Router } from '@angular/router';
import { faAnglesRight, faAnglesLeft, faBackward, faHome, faBookmark, faHandPointDown, faHandPointUp, faHandPointLeft} from '@fortawesome/free-solid-svg-icons';
import { YouTubePlayer } from '@angular/youtube-player';

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
  @ViewChild(YouTubePlayer) player: YouTubePlayer | undefined;
  readers: Reader[] = readers;
  private apiLoaded = false;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log(id);
      }
    })

    if(!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
    this.togglePlayPause();
  }

  stopVideo() {
    if (this.player)
      this.player.stopVideo();
  }

  togglePlayPause() {
    if (!this.player) return;

    if (this.player.getPlayerState() === 1) {
      // Video is currently playing, so pause it.
      this.player.pauseVideo();
    } else {
      // Video is paused, so play it.
      this.player.playVideo();
    }
  }
}
