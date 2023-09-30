import { Component } from '@angular/core';
import { faUpRightAndDownLeftFromCenter, faDownLeftAndUpRightToCenter, faCircleCheck, faCircle} from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { quranIndex } from 'src/app/data';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  quranAriaWidthSubject: Subject<number> = new Subject();
  quranAriaHeightSubject: Subject<number> = new Subject();

  openIcon = faUpRightAndDownLeftFromCenter;
  closeIcon = faDownLeftAndUpRightToCenter;
  faCircleCheck = faCircleCheck;
  faCircle = faCircle;

  quranIndex = quranIndex;
  isSideBarOpen = false;
  quranAriaWidth:number = 1396;
  quranAriaHeight:number = 1396;
  sideBarWidth:number = 40;

  ngOnInit() {
    this.quranAriaWidth = window.innerWidth - this.sideBarWidth;
  }

  toggleSideBar() {
    this.isSideBarOpen = !this.isSideBarOpen;
    this.sideBarWidth = this.isSideBarOpen ? 150 : 40;
    this.quranAriaWidth = window.innerWidth - this.sideBarWidth;
    this.quranAriaHeight = window.innerHeight - this.sideBarWidth;
    this.quranAriaWidthSubject.next(this.quranAriaWidth);
    this.quranAriaHeightSubject.next(this.quranAriaHeight);
  }
}
