

import { app } from 'electron';
import { ipcMain } from 'electron'
import { initDB } from './db/';
import { handlePhotoRequests, handleLabelRequests } from './endpoints/';
import * as fs from 'fs';

const LabelsChannel  = 'labels-request';
const PhotosChannel  = 'photos-request';
const CHANNELS = [LabelsChannel, PhotosChannel];

export function setupListeners() {
  ipcMain.on(LabelsChannel, handleLabelRequests);
  ipcMain.on(PhotosChannel, handlePhotoRequests);
}

export function teardownListeners() {
  ipcMain.removeAllListeners(CHANNELS)
}

export async function setupApp () {
  await initDB();
  await createDirectories();
}

async function createDirectories() {
  const DOCUMENTS = app.getPath('documents');
  const APP_FOLDER = 'collect';
  const PHOTOS = 'photos';

  const appDir = `${DOCUMENTS}/${APP_FOLDER}`
  const photosDir = `${DOCUMENTS}/${APP_FOLDER}/${PHOTOS}`;
  const directories = [appDir, photosDir];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
}

