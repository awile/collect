
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { initDB } from './main/db/';
import { setupListeners, teardownListeners } from './main/';

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

app.on('ready', () =>  {
  setupListeners();
  createWindow();
});

app.on('window-all-closed', () => {
  teardownListeners();
  app.quit()
})
