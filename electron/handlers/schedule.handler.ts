import { EventHandler } from './event-handler';
import { Job, scheduleJob } from 'node-schedule';

export class ScheduleEventHandler extends EventHandler {
  private cronJobs: Job[] = [];

  init() {
    super.init();
    this.cronJobs.forEach(job => job.cancel());
    this.cronJobs = [];

    const { on, send } = this;

    on('scheduling', 'cron', async (data) => {
      const { cron } = data.payload;
      const job = scheduleJob(cron, () => {
        send('scheduling', data.respondCommand);
      });
      this.cronJobs.push(job);
    });
  }
}
