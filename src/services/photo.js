
import { getConn } from '../db/';
import { getUuid } from '../db/utils';

export async function search(params = {}) {
  const { size, offset, labels } = params;
  const querySize = size || 10;
  const queryOffset = offset || 0;
  const knex = getConn();

  let query = null;
  if (labels) {
    query = knex('photoLabels')
      .join('photos', 'photoLabels.photo', 'photos.id')
      .select()
      .whereIn('photoLabels.label', labels)
      .offset(queryOffset)
      .limit(querySize)
      .orderBy('photos.created_at', 'desc');
  } else {
    query = knex('photos')
      .select()
      .offset(queryOffset)
      .limit(querySize)
      .orderBy('created_at', 'desc');
  }
  return await query;
}

export async function get(id) {
  if (!id) {
    throw new Error('retrieving a photo requires an id');
  }
  const knex = getConn();
  const query = knex('photos').first().where('id', id);
  return await query;
}

export async function create(photo) {
  if (!(photo.file_type && photo.name && photo.data)) {
    throw new Error('Photo requires fields: file_type, name, & data');
  }
  const knex = getConn();
  const newPhoto = Object.assign(photo, { id: getUuid() });
  const query = knex('photos').insert(newPhoto);
  const result = await query;
  return photo;
}
