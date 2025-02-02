import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import * as path from 'path';
import { handleEvents } from './handle-events';

export let mainWindow: any;

require('electron-reload')(__dirname);
initAppListeners();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
    },
  });

  mainWindow.webContents.on('did-finish-load', () => handleEvents());

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

function initAppListeners() {
  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (mainWindow === null) createWindow();
  });
}
