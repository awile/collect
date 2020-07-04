
import 'regenerator-runtime/runtime'
import knex from 'knex';
import { setupDBTables } from './schemas/';
import config from './config';

const conn = knex({
  client: 'sqlite3',
  connection: {
    filename: config.db.filename
  }
});

export async function initDB() {
  await setupDBTables(conn);
}

export function getConn() {
  return conn;
};

export const Photos = conn(config.tables.PHOTOS);
export const Labels = conn(config.tables.LABELS);
export const PhotoLabels = conn(config.tables.PHOTO_LABELS);
