import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurahReadingPageComponent } from './surah-reading-page.component';

describe('SurahReadingPageComponent', () => {
  let component: SurahReadingPageComponent;
  let fixture: ComponentFixture<SurahReadingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurahReadingPageComponent]
    });
    fixture = TestBed.createComponent(SurahReadingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
