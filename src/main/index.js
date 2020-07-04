

import { ipcMain } from 'electron'
import { handlePhotoRequests, handleLabelRequests } from './endpoints/';

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
