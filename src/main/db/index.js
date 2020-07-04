
import * as knex from 'knex';
import { setupDBTables } from './schemas/';
import config from './config';
import { newUuid } from './utils';

const conn = knex({
  client: 'sqlite3',
  connection: {
    filename: config.db.filename
  }
});

export async function initDB() {
  console.log('init db')
  await setupDBTables(conn);
}

export function getConn() {
  return conn;
};

export const Photos = config.tables.PHOTOS;
export const Labels = config.tables.LABELS;
export const PhotoLabels = config.tables.PHOTO_LABELS;
export const getUuid = newUuid;
