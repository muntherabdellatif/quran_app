import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { mofasreen } from '../data/tafseer';
import {
  faAnglesRight, faAnglesLeft, faAngleLeft, faAngleDown, faCheckSquare, faSquare,
  faStop, faPlay, faPause, faFileAudio, faFileVideo, faGear, faXmark
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressService } from '../services/progress.service';
import { LocalStorageService } from '../services/localStorage.service';

interface Video {
  link_id?: string,
  start?: number | null,
  end?: number | null,
  number?: number
}

interface Surah {
  id: number,
  name: string,
  videoArray: Video[],
}

interface Mofasreen {
  id: number,
  name: string,
  type: string,
  quran: Surah[],
}

@Component({
  selector: 'app-meditation',
  templateUrl: './meditation.component.html',
  styleUrls: ['./meditation.component.scss']
})
export class MeditationComponent {
  @ViewChild(YouTubePlayer) player: YouTubePlayer | undefined;
	@ViewChild('youTubePlayer') youTubePlayer: ElementRef<HTMLDivElement> | undefined;

  showSettingPopup: boolean = false;
  videoHeight: number | undefined;
	videoWidth: number | undefined;
	private apiLoaded = false;

  mofasreen: Mofasreen[] = mofasreen;
	surahId: number = 1;
	mofasrId: number = 1;
  videoIndex = 0;

  upDownAngle = faAngleDown;
	playPauseIcon = faPlay;
	faStop = faStop;
	faAnglesLeft = faAnglesLeft;
	faAngleLeft = faAngleLeft;
	faAnglesRight = faAnglesRight;
	faAngleDown = faAngleDown;
	faFileAudio = faFileAudio;
	faFileVideo = faFileVideo;
	faGear = faGear;
	faXmark = faXmark;
  faSquare = faSquare;
  faCheckSquare = faCheckSquare;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public progress: ProgressService,
		private changeDetectorRef: ChangeDetectorRef,
		public localStorageService: LocalStorageService,
	) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
			const id = params.get('id');
			const mofasrId = params.get('mofasr');
			if (id) this.surahId = +id;
			if (mofasrId) this.mofasrId = +mofasrId;
		})

		// prepare youtube player
		if (!this.apiLoaded) {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			document.body.appendChild(tag);
			this.apiLoaded = true;
		}
  }

  playerPlayedPaused(event: any) {
		if (event.data == 2)
			return this.playPauseIcon = faPlay;
		if (event.data == 3)
			return this.playPauseIcon = faPause;

		return;
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

  stopVideo() {
		if (this.player)
			this.player.stopVideo();
	}


	ToggleSettingPopup() {
		this.showSettingPopup = !this.showSettingPopup;
	}
}
