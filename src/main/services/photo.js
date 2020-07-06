
import {
  getConn,
  getUuid,
  Photos,
  PhotoLabels
} from '../db/';
import { writePhoto } from './utils';


export async function search(params = {}) {
  const { size, offset, labels } = params;
  const querySize = size || 10;
  const queryOffset = offset || 0;
  const knex = getConn();

  let query = null;
  if (labels) {
    query = knex(PhotoLabels)
      .join(Photos, 'photoLabels.photo', 'photos.id')
      .select()
      .whereIn('photoLabels.label', labels)
      .offset(queryOffset)
      .limit(querySize)
      .orderBy('photos.created_at', 'desc');
  } else {
    query = knex(Photos)
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
  const query = knex(Photos).first().where('id', id);
  return await query;
}

export async function create(photo) {
  if (!(photo.file_type && photo.name && photo.data)) {
    throw new Error('Photo requires fields: file_type, name, & data');
  }
  const imageData = photo.data.replace(/^data:image\/\w+;base64,/, "");
  const imagePath = await writePhoto(`${photo.name}.${photo.file_type}`, imageData);
  const knex = getConn();
  const newPhoto = {
    name: photo.name,
    file_type: photo.file_type,
    location: imagePath
  };
  const query = knex(Photos).insert(newPhoto);
  const result = await query;
  return photo;
}
