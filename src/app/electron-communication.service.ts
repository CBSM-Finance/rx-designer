import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectronCommunicationService {
  send(channel: string, command: string, payload?: any) {
    console.log(`send [${channel}]`, { command, payload });
    const data = {
      command,
      payload,
    };
    setTimeout(() => this.es.ipcRenderer.send(channel, data), 0);
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
