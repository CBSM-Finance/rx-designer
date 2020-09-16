import { Component, Input, OnInit } from '@angular/core';
import { ReactiveGraph } from '@cbsm-finance/reactive-nodes';
import { Subscription } from 'rxjs';
import { Designer } from '../designer/designer';
import { ElectronCommunicationService } from '../electron-communication.service';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() designer: Designer;

  private sub: Subscription;

  constructor(
    private ecs: ElectronCommunicationService,
    private logger: LoggerService,
  ) { }

  ngOnInit(): void {}

  save() {
    this.designer.save();
  }

  run() {
    if (this.sub) this.sub.unsubscribe();
    this.sub = this.designer.run({
      electron: this.ecs,
      logger: this.logger,
    });
  }
}
