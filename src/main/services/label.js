
import {
  getConn,
  getUuid,
  Labels
} from '../db/';

export async function search(params = {}) {
  const knex = getConn();
  const { size, offset } = params;
  const querySize = size || 10;
  const queryOffset = offset || 0;

  const query = knex(Labels)
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
  const query = knex(Labels).first().where('id', id);
  return await query;
}

export async function update(newLabel) {
  if (!(newLabel.name && newLabel.id)) {
    throw new Error('Updating Label requires a name');
  }
  const knex = getConn();
  const queryLabel = knex(Labels).select().where('id', label.id);
  const label = await queryLabel;
  if (!label) {
    throw new Error(`No label with id ${label.id} found`);
  }
  const updateLabel = Object.assign(label, newLabel);
  const query = knex(Labels)
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
  const query = knex(Labels).insert(newLabel);
  const result = await query;
  return label;
}

