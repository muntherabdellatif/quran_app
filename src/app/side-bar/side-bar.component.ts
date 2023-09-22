import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { faHome, faArrowUpAZ, faArrowDownAZ, faBars } from '@fortawesome/free-solid-svg-icons';
import { SideBarService } from '../services/side_bar.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  itIsFirstTime = false;
  currentUrl: string = '/';
  showBigSurah = true;
  showSmallSurah = true;
  showSurahList = false;

  faArrowUpAZ = faArrowUpAZ;
  faArrowDownAZ = faArrowDownAZ;
  faHome = faHome;
  faBars = faBars;

  constructor(
    private router: Router,
    private sideBar: SideBarService
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url;
        console.log(this.currentUrl);
      }
    });
  }

  toggleShowBigSurah() {
    this.sideBar.toggleShowBigSurah();
    this.showBigSurah = this.sideBar.getShowBigSurah();
  }

  toggleShowSmallSurah() {
    this.sideBar.toggleShowSmallSurah();
    this.showSmallSurah = this.sideBar.getShowSmallSurah();
  }

  toggleShowSurahList() {
    this.sideBar.toggleShowSurahList();
    this.showSurahList = this.sideBar.getShowSurahList();
  }
}
