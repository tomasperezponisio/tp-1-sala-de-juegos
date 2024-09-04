import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Juego4Component } from './juego4.component';

describe('Juego4Component', () => {
  let component: Juego4Component;
  let fixture: ComponentFixture<Juego4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Juego4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Juego4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
