import { tap } from 'rxjs/operators';
import { IBConnectorClient } from '@cbsm-finance/ib-connector-ts-client';
import { ipcMain } from 'electron';
import { log } from './log';
import { IBConnectorType } from '@cbsm-finance/ib-connector-ts-client/dist/types/ib-connector-type';
import { SubSink } from 'subsink';

const subs = new SubSink();
const client = new IBConnectorClient('./');

export function handleEvents(mainWindow: any) {

  ipcMain.removeAllListeners();
  subs.unsubscribe();
  client.kill();

  const localCommands = ['launch'];

  on('ib', cmd => !localCommands.includes(cmd), (data) => client.send({
    type: data.command,
    respondCommand: data.respondCommand,
    ...data.payload,
  }));

  on('ib', 'launch', async (data) => {
    client.launch();

    subs.sink = client.inMessages
      .pipe(
        tap((msg) => {
          console.log('got message', msg);
          send('ib', (msg as any).respondCommand ?? 'message', msg);
        }),
      )
      .subscribe();

    subs.sink = client.errors
      .pipe(tap((err) => send('ib', 'message', {
        type: 'iberror',
        msg: err,
      })))
      .subscribe();

    send('ib', data.respondCommand);
  });

  // on('ib', 'connect tws', async () => {
  //   client.send<IBConnect>({
  //     type: 'connect',
  //     port: 4200,
  //     host: '127.0.0.1',
  //     clientId: 1,
  //   });
  // });

  function send(channel: string, command: string, payload?: any): void {
    log.notify(`send [${channel}]`, { command, payload });
    const msg = { command, payload };
    mainWindow.webContents.send(channel, msg);
  }
}

export function on(
  channel: string,
  command: string | ((cmd: string) => boolean),
  callback: (data: any) => any
) {
  return ipcMain.on(channel, async (event: any, data: any) => {
    if (!isCommand(command, data.command)) return;

    try {
      await callback(data);

      // event.reply(channel, {
      //   command: respondCommand,
      //   success: true,
      // });
    } catch (e) {
      throw e;
      // event.reply(channel, {
      //   command: respondCommand,
      //   success: false,
      //   e,
      // });
    }
  });
}

export interface IBConnect extends IBConnectorType {
  port: number;
  host: string;
  clientId: number;
}

export function isCommand(command: string | ((c: string) => boolean), cmd: string): boolean {
  if (typeof command === 'string') return command === cmd;
  return command(cmd);
}
