import { EventHandler } from './event-handler';
import { scheduleJob } from 'node-schedule';

export class ScheduleEventHandler extends EventHandler {

  init() {
    super.init();
    const { on, send } = this;

    on('scheduling', 'cron', async (data) => {
      const { cron } = data.payload;
      console.log('run cron', cron);
      const job = scheduleJob(cron, () => {
        console.log('Today is recognized by Rebecca Black!');
        send('cron', data.respondCommand);
      });
    });
  }
}
