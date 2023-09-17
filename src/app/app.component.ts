import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  itIsFirstTime = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    ["memorizing", "interpretation", "lastReadingTime", "lastListeningTime"].forEach((key) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(Array.from({ length: 144 }, () => 0)));
      }
    })
  }
}
