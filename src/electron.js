
import { app, BrowserWindow, protocol } from 'electron';
import * as path from 'path';
import { setupApp, setupListeners, teardownListeners } from './main/';
import { ipcMain } from 'electron'
import * as url from 'url';
import { autoUpdater } from 'electron-updater';

function createWindow() {
  const isDev = process.env.NODE_ENV === 'development';
  let preferences =  {
    nodeIntegration: true
  };
  if (isDev) {
    preferences.webSecurity = false;
  }
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    titleBarStyle: 'hiddenInset',
    webPreferences: preferences
  });

  let mainReady = false;
  ipcMain.on('main-status-check', (event, args) => {
      event.reply('main-status', { status: mainReady ? 'ok' : 'not ok' });
  });
  mainWindow.webContents.once('dom-ready', () => {
    setupApp().then(() => { mainReady = true; });
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    const startUrl = url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:'
    });
    mainWindow.loadURL(startUrl);
  }
}

app.on('ready', () =>  {
  setupListeners();
  createWindow();
});

app.on('ready-to-show', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = request.url.replace('file:///', '');
    callback(pathname);
  })
});

app.on('window-all-closed', () => {
  teardownListeners();
  app.quit()
})

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

// autoUpdater.on('update-available', () => {
//   console.log('Update Available');
//   mainWindow.webContents.send('update_available');
// });
// autoUpdater.on('update-downloaded', () => {
//   console.log('Update downloaded');
//   mainWindow.webContents.send('update_downloaded');
// });

