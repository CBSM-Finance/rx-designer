import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, ReplaySubject } from 'rxjs';
import { scan, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  logs: Observable<Log[]>;

  private logsSubject = new ReplaySubject<Log>();

  log(transform: (msg: any) => Log): OperatorFunction<any, any> {
    return source => source.pipe(
      tap(msg => this.logsSubject.next(transform(msg))),
    );
  }

  reset() {
    this.logsSubject.next(void 0);
  }

  constructor() {
    this.logs = this.logsSubject.pipe(
      scan((acc, log) => log === void 0 ? [] : [...acc, log], []),
    );
  }
}

export type LogLevel = 'info' | 'error';
export interface Log {
  level: LogLevel;
  msg: any;
  node: string;
}
