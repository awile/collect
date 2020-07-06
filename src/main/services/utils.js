
import { app } from 'electron';
import * as fs from 'fs';
import * as util from 'util';

const DOCUMENTS = app.getPath('documents');
const APP_FOLDER = 'collect';
const PHOTOS = 'photos';
const writeFile = util.promisify(fs.writeFile);

export async function writePhoto(name, data) {
  try {
    const file = `${DOCUMENTS}/${APP_FOLDER}/${PHOTOS}/${name}`
    await writeFile(file, data, 'base64');
    return file;
  } catch (err) {
    throw err;
  }
}

export async function ff() {
  return
}
