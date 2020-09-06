import { on, send } from './main';
import { tap } from 'rxjs/operators';
import { IBConnectorClient } from '@cbsm-finance/ib-connector-ts-client';

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
