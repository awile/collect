
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { initDB } from './main/db/';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.webContents.once('dom-ready', () => {
    initDB().then(() => {
      mainWindow.webContents.send('ready')
    });
  });
  mainWindow.loadURL('http://localhost:3000');
}

app.on('ready', createWindow);
