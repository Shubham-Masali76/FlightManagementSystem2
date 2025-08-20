import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeditFlightComponent } from './vedit-flight.component';

describe('VeditFlightComponent', () => {
  let component: VeditFlightComponent;
  let fixture: ComponentFixture<VeditFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeditFlightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VeditFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
