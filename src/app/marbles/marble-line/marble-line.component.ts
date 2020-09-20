import { Component, Input, OnInit } from '@angular/core';
import { DesignerNode } from '../../nodes/designer-node';
import { MarblesService } from '../marbles.service';

@Component({
  selector: 'app-marble-line',
  templateUrl: './marble-line.component.html',
  styleUrls: ['./marble-line.component.scss']
})
export class MarbleLineComponent implements OnInit {
  @Input() node: DesignerNode;

  constructor(
    public ms: MarblesService,
  ) { }

  ngOnInit(): void {
  }
}
