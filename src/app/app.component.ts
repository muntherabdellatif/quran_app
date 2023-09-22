import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  itIsFirstTime = false;

  ngOnInit() {
    ["memorizing", "interpretation", "lastReadingTime", "lastListeningTime"].forEach((key) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(Array.from({ length: 144 }, () => 0)));
      }
    })
  }
}
