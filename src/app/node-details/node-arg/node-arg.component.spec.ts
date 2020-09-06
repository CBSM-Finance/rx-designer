import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeArgComponent } from './node-arg.component';

describe('NodeArgComponent', () => {
  let component: NodeArgComponent;
  let fixture: ComponentFixture<NodeArgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeArgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeArgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
