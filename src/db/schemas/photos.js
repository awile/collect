
import config from '../config';
import { getUuid } from '../utils';
import moment from 'moment';

const PHOTOS = config.tables.PHOTOS;

export async function setupPhotosTable(knex) {
  const exists = await knex.schema.hasTable(PHOTOS);
  if (!exists) {
    console.log('creating photos table...')
    await knex.schema.createTable(PHOTOS, (table) => {
      table.uuid('id', 36).primary();
      table.string('name', 255);
      table.string('file_type', 10);
      table.string('created_at').defaultTo(moment().toISOString());
      table.binary('data');
    });
    console.log('created photos table.');
  }
};
