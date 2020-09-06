import { app, BrowserWindow, ipcMain } from 'electron';
import * as url from 'url';
import * as path from 'path';
import { handleEvents } from './handle-events';

let mainWindow: any;
const args = process.argv.slice(1);
const serve = args.some((val) => val === '--serve');
if (serve) {
  require('electron-reload')(__dirname, {});
}

handleEvents();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      // contextIsolation: true,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  );

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

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
