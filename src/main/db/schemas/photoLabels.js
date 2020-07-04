
import config from '../config';
import { getUuid } from '../utils';
import * as moment from 'moment';

const PHOTO_LABELS = config.tables.PHOTO_LABELS;

export async function setupPhotoLabelsTable(knex) {
  const exists = await knex.schema.hasTable(PHOTO_LABELS);
  if (!exists) {
    console.log('creating photoLabels table...')
    await knex.schema.createTable(PHOTO_LABELS, (table) => {
      table.uuid('id', 36).primary();
      table.uuid('photo', 36);
      table.uuid('label', 36);
      table.boolean('deleted').defaultTo(false);
      table.string('created_at').defaultTo(moment().toISOString());
      table.string('last_modified').defaultTo(moment().toISOString());
      table.primary(['photo', 'label']);
    });
    console.log('created photoLabels table')
  }
};

