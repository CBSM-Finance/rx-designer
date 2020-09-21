import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectronCommunicationService {
  private msgId = 0;

  send(channel: string, command: string, payload?: any, expectResponse = false): Observable<any> {
    const respondCommand = `${command}_response_${++this.msgId}`;
    console.log(`send [${channel}]`, { command, payload, respondCommand });
    const data = {
      command,
      payload,
      respondCommand,
    };
    setTimeout(() => this.es.ipcRenderer.send(channel, data), 0);

    if (!expectResponse) return EMPTY;
    return this.on(channel, respondCommand);
  }

  on(channel: string, command: string): Observable<any> {
    return new Observable(observer => {
      const listener = (_: any, data: any) => {
        if (data.command !== command) return;
        observer.next(data.payload);
      };
      this.es.ipcRenderer.on(channel, listener);
      return () => this.es.ipcRenderer.removeListener(channel, listener);
    });
  }

  constructor(
    private es: ElectronService,
  ) { }
}
