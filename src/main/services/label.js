
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
  const queryLabel = knex(Labels).first().where('id', newLabel.id);
  const label = await queryLabel;
  if (!label) {
    throw new Error(`No label with id ${label.id} found`);
  }
  const updateLabel = Object.assign(label, { name: newLabel.name });
  const query = knex(Labels)
    .update('name', updateLabel.name)
    .where('id', updateLabel.id);
  const result = await query;
  return updateLabel;
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

export async function deleteLabel(labelId) {
  if (!labelId) {
    throw new Error('no label id given');
  }
  const knex = getConn();
  const query = knex(Labels)
    .del()
    .where('id', labelId);
  const result = await query;
  return ({ deleted: result === 1  });
}
