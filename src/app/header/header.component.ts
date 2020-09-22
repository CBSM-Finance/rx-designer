import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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

  running = false;

  private kill: () => any;

  constructor(
    private ecs: ElectronCommunicationService,
    private logger: LoggerService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {}

  save() {
    this.designer.save();
  }

  run() {
    this.running = true;
    this.kill = this.designer.run({
      electron: this.ecs,
      logger: this.logger,
    });
    this.cdRef.detectChanges();
  }

  stop() {
    if (this.kill) this.kill();
    this.running = false;
    this.cdRef.detectChanges();
  }
}
