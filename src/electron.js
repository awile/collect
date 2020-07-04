
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { initDB } from './main/db/';
import { setupListeners, teardownListeners } from './main/';
import { ipcMain } from 'electron'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true
    }
  });


  let mainReady = false;
  ipcMain.on('main-status-check', (event, args) => {
      event.reply('main-status', { status: mainReady ? 'ok' : 'not ok' });
  });
  mainWindow.webContents.once('dom-ready', () => {
    initDB().then(() => { mainReady = true; });
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
