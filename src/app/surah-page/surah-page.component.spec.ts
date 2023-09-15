import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurahPageComponent } from './surah-page.component';

describe('SurahPageComponent', () => {
  let component: SurahPageComponent;
  let fixture: ComponentFixture<SurahPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurahPageComponent]
    });
    fixture = TestBed.createComponent(SurahPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
