import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoggerService, Log } from '../logger.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {
  logs: Observable<Log[]>;
  nodeFilter = '';
  nodeNames: Observable<[string, number][]>;

  private subs = new SubSink();

  constructor(
    logger: LoggerService,
  ) {
    this.logs = logger.logs;
    this.nodeNames = this.logs.pipe(
      map(logs => logs.reduce<any>((nodes, log) => ({ ...nodes, [log.node]: (nodes[log.node] || 0) + 1 }), { '': logs.length })),
      map<any, any>(nodes => Object.entries(nodes)),
    );
  }

  filterByNode(nodeName: string) {
    this.nodeFilter = nodeName;
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
