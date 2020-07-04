
import config from '../config';
import { getUuid } from '../utils';
import * as moment from 'moment';

const LABELS = config.tables.LABELS;

export async function setupLabelsTable(knex) {
  const exists = await knex.schema.hasTable(LABELS);
  if (!exists) {
    console.log('creating labels table...')
    await knex.schema.createTable(LABELS, (table) => {
      table.uuid('id', 36).primary();
      table.string('name', 255);
      table.boolean('deleted').defaultTo(false);
      table.string('created_at').defaultTo(moment().toISOString());
      table.string('last_modified').defaultTo(moment().toISOString());
    });
    console.log('created labels table.')
  }
};

