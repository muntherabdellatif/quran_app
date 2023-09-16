import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurahListeningPageComponent } from './surah-listening-page.component';

describe('SurahListeningPageComponent', () => {
  let component: SurahListeningPageComponent;
  let fixture: ComponentFixture<SurahListeningPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurahListeningPageComponent]
    });
    fixture = TestBed.createComponent(SurahListeningPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
