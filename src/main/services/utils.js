
import { app } from 'electron';
import * as fs from 'fs';
import * as util from 'util';

const DOCUMENTS = app.getPath('documents');
const DOWNLOADS = app.getPath('downloads');
const APP_FOLDER = 'collect';
const PHOTOS = 'photos';
const writeFile = util.promisify(fs.writeFile);
const removeFile = util.promisify(fs.unlink);
const readFile = util.promisify(fs.readFile);

export async function writePhoto(name, data) {
  try {
    const file = `${DOCUMENTS}/${APP_FOLDER}/${PHOTOS}/${name}`
    await writeFile(file, data, 'base64');
    return file;
  } catch (err) {
    throw err;
  }
}

export async function removePhoto(filePath) {
  try {
    await removeFile(filePath);
  } catch (err) {
    throw err;
  }
}

export async function readPhoto(filePath) {
  try {
    return await readFile(filePath);
  } catch (err) {
    throw err;
  }
}

export async function writeToDownloads(name, data) {
  try {
    const file = `${DOWNLOADS}/${name}`;
    await writeFile(file, data, 'base64');
  } catch (err) {
    throw err;
  }
}
