import { SubSink } from 'subsink';
import { IpcMain, ipcMain } from 'electron';
import { log } from '../log';
import { mainWindow } from '../main';

export class EventHandler {
  subs = new SubSink();

  constructor() { }

  init() {
    this.subs.unsubscribe();
  }

  send(channel: string, command: string, payload?: any): void {
    log.notify(`send [${channel}]`, { command, payload });
    const msg = { command, payload };
    mainWindow.webContents.send(channel, msg);
  }

  on(
    channel: string,
    command: string | ((cmd: string) => boolean),
    callback: (data: any) => any
  ): IpcMain {
    return ipcMain.on(channel, async (event: any, data: any) => {
      if (!isCommand(command, data.command)) return;
      try {
        await callback(data);
      } catch (e) {
        log.error(channel, data.command, e);
      }
    });
  }
}

export function isCommand(command: string | ((c: string) => boolean), cmd: string): boolean {
  if (typeof command === 'string') return command === cmd;
  return command(cmd);
}

