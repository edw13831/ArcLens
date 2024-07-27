import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotsWidgetComponent } from './spots-widget.component';

describe('SpotsWidgetComponent', () => {
  let component: SpotsWidgetComponent;
  let fixture: ComponentFixture<SpotsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
