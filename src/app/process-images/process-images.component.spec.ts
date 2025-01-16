import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessImagesComponent } from './process-images.component';

describe('ProcessImagesComponent', () => {
  let component: ProcessImagesComponent;
  let fixture: ComponentFixture<ProcessImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
