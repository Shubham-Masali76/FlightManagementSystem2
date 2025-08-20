import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VviewFlightComponent } from './vview-flight.component';

describe('VviewFlightComponent', () => {
  let component: VviewFlightComponent;
  let fixture: ComponentFixture<VviewFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VviewFlightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VviewFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
