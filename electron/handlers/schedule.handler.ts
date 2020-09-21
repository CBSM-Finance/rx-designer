import { EventHandler } from './event-handler';
import { Job, scheduleJob } from 'node-schedule';

export class ScheduleEventHandler extends EventHandler {
  private cronJobs: Job[] = [];

  init() {
    super.init();
    this.cronJobs.forEach(job => job.cancel());
    this.cronJobs = [];

    const { on, send } = this;

    console.log('init scheduler');

    on('scheduling', 'cron', async (data) => {
      const { cron } = data.payload;
      console.log('run cron', cron);
      const job = scheduleJob(cron, () => {
        console.log('Today is recognized by Rebecca Black!');
        send('scheduling', data.respondCommand);
      });
      this.cronJobs.push(job);
    });
  }
}
