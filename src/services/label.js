
import { getConn } from '../db/';
import { getUuid } from '../db/utils';

export async function search(params = {}) {
  const knex = getConn();
  const { size, offset } = params;
  const querySize = size || 10;
  const queryOffset = offset || 0;

  const query = knex('labels')
    .select()
    .offset(queryOffset)
    .limit(querySize)
    .orderBy('created_at', 'desc');
  return await query;
}

export async function get(id) {
  if (!id) {
    throw new Error('retrieving a label requires an id');
  }
  const knex = getConn();
  const query = knex('labels').first().where('id', id);
  return await query;
}

export async function update(newLabel) {
  if (!(newLabel.name && newLabel.id)) {
    throw new Error('Updating Label requires a name');
  }
  const knex = getConn();
  const queryLabel = knex('labels').select().where('id', label.id);
  const label = await queryLabel;
  if (!label) {
    throw new Error(`No label with id ${label.id} found`);
  }
  const updateLabel = Object.assign(label, newLabel);
  const query = Labels
    .where('id', updateLabel.id)
    .update(updateLabel);
  return await query;
}

export async function create(label) {
  if (!label.name) {
    throw new Error('Label name is required');
  }
  const knex = getConn();
  const newLabel = Object.assign(label, { id: getUuid() });
  const query = knex('labels').insert(newLabel);
  const result = await query;
  return label;
}

