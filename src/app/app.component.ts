import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LightService } from './services/light.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	itIsFirstTime = false;

	readonly oneDayUnix: number = 84600;

	numbers: any = {
		1: '001',
		2: '002',
		3: '003',
		4: '004',
		5: '005',
		6: '006',
		7: '007',
		8: '008',
		9: '009',
		10: '010',
		11: '011',
		12: '012',
		13: '013',
		14: '014',
		15: '015',
		16: '016',
		17: '017',
		18: '018',
		19: '019',
		20: '020',
		21: '021',
		22: '022',
		23: '023',
		24: '024',
		25: '025',
		26: '026',
		27: '027',
		28: '028',
		29: '029',
		30: '030',
		31: '031',
		32: '032',
		33: '033',
		34: '034',
		35: '035',
		36: '036',
		37: '037',
		38: '038',
		39: '039',
		40: '040',
		41: '041',
		42: '042',
		43: '043',
		44: '044',
		45: '045',
		46: '046',
		47: '047',
		48: '048',
		49: '049',
		50: '050',
		51: '051',
		52: '052',
		53: '053',
		54: '054',
		55: '055',
		56: '056',
		57: '057',
		58: '058',
		59: '059',
		60: '060',
		61: '061',
		62: '062',
		63: '063',
		64: '064',
		65: '065',
		66: '066',
		67: '067',
		68: '068',
		69: '069',
		70: '070',
		71: '071',
		72: '072',
		73: '073',
		74: '074',
		75: '075',
		76: '076',
		77: '077',
		78: '078',
		79: '079',
		80: '080',
		81: '081',
		82: '082',
		83: '083',
		84: '084',
		85: '085',
		86: '086',
		87: '087',
		88: '088',
		89: '089',
		90: '090',
		91: '091',
		92: '092',
		93: '093',
		94: '094',
		95: '095',
		96: '096',
		97: '097',
		98: '098',
		99: '099',
		100: '100',
		101: '101',
		102: '102',
		103: '103',
		104: '104',
		105: '105',
		106: '106',
		107: '107',
		108: '108',
		109: '109',
		110: '110',
		111: '111',
		112: '112',
		113: '113',
		114: '114',
	};

	constructor(
		private router: Router,
		private light: LightService,
		private translate: TranslateService,
		private http: HttpClient,
	) {
		this.translate.setDefaultLang('ar');
	}

	ngOnInit() {
		// this.download();
		this.checkLastVisitTime();

		["lastReadingTime", "lastListeningTime"].forEach((key) => {
			if (!localStorage.getItem(key)) {
				localStorage.setItem(key, JSON.stringify(Array.from({ length: 144 }, () => 0)));
			}
		});

		this.light.init();
	}

	getFiles(url: string): Observable<Blob> {
		return this.http.get(url, {
			responseType: 'blob'
		})
	}

	download() {
		const url = 'https://server12.mp3quran.net/salamah/Rewayat-Hafs-A-n-Assem/'
		for (let i = 91; i <= 114; i++)
			this.getFiles(url + this.numbers[i] + '.mp3').subscribe(blob => {
				const a = document.createElement('a')
				const objectUrl = URL.createObjectURL(blob)
				a.href = objectUrl
				a.download = this.numbers[i] + '.mp3';
				a.click();
				URL.revokeObjectURL(objectUrl);
			})
	}

	checkLastVisitTime() {
		const lastVisitTime = +(localStorage.getItem('last-visit-reminder') || '');
		if (!lastVisitTime)
			return this.router.navigate(['visit_reminder']);

		if ((Date.now() - lastVisitTime) / 1000 >= this.oneDayUnix)
			return this.router.navigate(['visit_reminder']);

		return;
	}

}
