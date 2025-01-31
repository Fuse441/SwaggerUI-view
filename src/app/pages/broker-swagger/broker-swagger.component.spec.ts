import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerSwaggerComponent } from './broker-swagger.component';

describe('BrokerSwaggerComponent', () => {
  let component: BrokerSwaggerComponent;
  let fixture: ComponentFixture<BrokerSwaggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerSwaggerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerSwaggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
