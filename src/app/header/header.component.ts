import { ChangeDetectorRef, Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Designer } from '../designer/designer';
import { ElectronCommunicationService } from '../electron-communication.service';
import { LoggerService } from '../logger.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Input() designer: Designer;

  running: Observable<boolean>;

  private kill: () => any;

  constructor(
    private ecs: ElectronCommunicationService,
    private logger: LoggerService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {
    this.running = this.designer.running;
  }

  ngOnInit(): void { }

  save() {
    this.designer.save();
  }

  run() {
    this.kill = this.designer.run({
      electron: this.ecs,
      logger: this.logger,
    });
    this.cdRef.detectChanges();
  }

  stop() {
    if (this.kill) this.kill();
  }
}
