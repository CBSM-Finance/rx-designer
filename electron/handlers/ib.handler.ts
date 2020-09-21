import { IBConnectorClient } from '@cbsm-finance/ib-connector-ts-client';
import { EventHandler } from './event-handler';
import { tap } from 'rxjs/operators';
import { IBConnectorType } from '@cbsm-finance/ib-connector-ts-client/dist/types/ib-connector-type';

export class IBEventHandler extends EventHandler {
  client = new IBConnectorClient('./');

  private localCommands = ['launch'];

  init() {
    super.init();
    this.client.kill();

    this.observeLaunch();
    this.observeAll();
  }

  private observeLaunch() {
    const { on, client, subs, send } = this;

    on('ib', 'launch', async (data) => {
      client.launch();

      // ibapi messages
      subs.sink = client.inMessages
        .pipe(tap((msg) => send('ib', (msg as any).respondCommand ?? 'message', msg)))
        .subscribe();

      // ibapi errors
      subs.sink = client.errors
        .pipe(tap((err) => send('ib', 'message', {
          type: 'iberror',
          msg: err,
        })))
        .subscribe();

      // ib launched
      send('ib', data.respondCommand);
    });
  }

  private observeAll() {
    const { on, localCommands, client } = this;

    on(
      'ib',
      (cmd) => !localCommands.includes(cmd),
      (data) => client.send({
        type: data.command,
        respondCommand: data.respondCommand,
        ...data.payload,
      }),
    );
  }
}

export interface IBConnect extends IBConnectorType {
  port: number;
  host: string;
  clientId: number;
}
