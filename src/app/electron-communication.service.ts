import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectronCommunicationService {
  send(channel: string, command: string, payload?: any) {
    const data = {
      command,
      payload,
    };
    this.es.ipcRenderer.send(channel, data);
  }

  on(channel: string, command: string): Observable<any> {
    return new Observable(observer => {
      const listener =  (_: any, data: any) => {
        if (data.command !== command) return;
        observer.next(data);
      };
      this.es.ipcRenderer.on(channel, listener);
      return () => this.es.ipcRenderer.removeListener(channel, listener);
    });
  }

  constructor(
    private es: ElectronService,
  ) { }
}
