import { tap } from 'rxjs/operators';
import { IBConnectorClient } from '@cbsm-finance/ib-connector-ts-client';
import { BrowserWindow, ipcMain } from 'electron';

declare const mainWindow: BrowserWindow;

export function handleEvents() {
  const client = new IBConnectorClient('./');

  on('ib', 'launch', async () => {
    client.launch();
    send('ib', 'launched');
  });

  on('ib', 'observe messages', async () => {
    client.inMessages
      .pipe(tap((msg) => send('ib', 'message', msg)))
      .subscribe();
  });
}

export function on(
  channel: string,
  command: string,
  callback: (data: any) => any
) {
  return ipcMain.on(channel, async (event, data) => {
    if (data.command !== command) return;
    const respondCommand = `${channel}_response`;

    try {
      await callback(data);

      event.reply(channel, {
        command: respondCommand,
        success: true,
      });
    } catch (e) {
      event.reply(channel, {
        command: respondCommand,
        success: false,
        e,
      });
    }
  });
}

export function send(channel: string, command: string, payload?: any): void {
  const msg = { command, payload };
  mainWindow.webContents.send(channel, msg);
}
