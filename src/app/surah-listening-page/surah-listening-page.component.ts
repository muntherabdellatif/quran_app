import { Component, ViewChild } from '@angular/core';
import { readers } from '../data/readers';
import { ActivatedRoute, Router } from '@angular/router';
import { faAnglesRight, faAnglesLeft, faStop, faPlay, faPause, faHome} from '@fortawesome/free-solid-svg-icons';
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
  surahId: number = 0;
  readerId: number = 0;
  private apiLoaded = false;

  playPauseIcon = faPlay;
  faStop = faStop;
  faAnglesLeft = faAnglesLeft;
  faAnglesRight = faAnglesRight

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    // get surah id
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const readerId = params.get('reader');
      if (id) this.surahId = +id;
      if (readerId) this.readerId = +readerId;
    })

    // prepare youtube player
    if(!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
    this.togglePlayPause();

    // get default reader
  }

  stopVideo() {
    if (this.player)
      this.player.stopVideo();
  }

  togglePlayPause() {
    if (!this.player) return;

    if (this.player.getPlayerState() === 1) {
      this.player.pauseVideo();
      this.playPauseIcon = faPlay;
    } else {
      this.player.playVideo();
      this.playPauseIcon = faPause;
    }
  }

  resetVideo() {
    if (this.player)
      this.player.stopVideo();
    this.playPauseIcon = faPlay;
  }
}
