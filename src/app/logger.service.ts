import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  logs: Observable<Log>;

  private logsSubject = new ReplaySubject<Log>();

  log(transform: (msg: any) => Log): OperatorFunction<any, any> {
    return source => source.pipe(
      tap(msg => this.logsSubject.next(transform(msg))),
    );
  }

  constructor() {
    this.logs = this.logsSubject.asObservable();
  }
}

export type LogLevel = 'info' | 'error';
export interface Log {
  level: LogLevel;
  msg: any;
  node: string;
}
