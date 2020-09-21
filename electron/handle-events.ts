import { ScheduleEventHandler } from './handlers/schedule.handler';
import { IBEventHandler } from './handlers/ib.handler';
import { ipcMain } from 'electron';
import { EventHandler } from 'handlers/event-handler';

const handlers: EventHandler[] = [
  new IBEventHandler(),
  new ScheduleEventHandler(),
];

export function handleEvents() {
  ipcMain.removeAllListeners();
  handlers.forEach(handler => handler.init());
}
