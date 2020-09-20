import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoggerService, Log } from '../logger.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {
  logs: Observable<Log[]>;

  private subs = new SubSink();

  constructor(
    logger: LoggerService,
  ) {
    this.logs = logger.logs;
  }

  trackByFn(index: number) {
    return index;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
  }

}
