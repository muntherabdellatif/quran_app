import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quran-pages',
  templateUrl: './quran-pages.component.html',
  styleUrls: ['./quran-pages.component.scss']
})
export class QuranPagesComponent {
  pageIdNumber = 1;
  pageId = "001";
  pagesNumber: any[]= Array.from({ length: 604 }, (_, index) => index + 1);
  lastScrollPosition: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
  ) {
    this.pagesNumber.forEach(n => {
      this.pagesNumber[n - 1] = String(this.pagesNumber[n - 1]).padStart(3, '0')
    });
  }

  ngAfterViewInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pageIdNumber = +id - 1;
        this.pageId = this.pagesNumber[this.pageIdNumber];

        // Scroll to the image with the specified ID
        setTimeout(() => {
          const imageElement = this.el.nativeElement.querySelector(`#page-${this.pageId}`);
          console.log("imageElement : ", imageElement);
          if (imageElement) {
            imageElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 800);
      }
    })
  }
}
