import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuranAriaComponent } from './quran-aria.component';

describe('QuranAriaComponent', () => {
  let component: QuranAriaComponent;
  let fixture: ComponentFixture<QuranAriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuranAriaComponent]
    });
    fixture = TestBed.createComponent(QuranAriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
