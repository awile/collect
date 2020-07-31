
import {
  getConn,
  getUuid,
  Photos,
  PhotoLabels,
  Labels,
} from '../db/';
import { writePhoto } from './utils';
import * as PhotoLabelService from './photoLabel';


export async function search(params = {}) {
  const { size, offset, labels } = params;
  const queryOffset = offset || 0;
  const knex = getConn();

  let photos = [];
  if (labels) {
    let query = knex(PhotoLabels)
      .join(Photos, 'photoLabels.photo', 'photos.id')
      .select()
      .whereIn('photoLabels.label', labels)
      .offset(queryOffset)
      .orderBy('photos.created_at', 'desc');
    photos = await query;
  } else {
    let query = knex(Photos)
      .select()
      .offset(queryOffset)
      .orderBy('created_at', 'desc');
    photos = await query;
  }
  const photoLabels =
    await Promise.all(photos.map(async (p) => await getLabels(p.id)));
  photoLabels.forEach((labels, i) => photos[i].labels = labels);
  return photos;
}

export async function get(id) {
  if (!id) {
    throw new Error('retrieving a photo requires an id');
  }
  const knex = getConn();
  const query = knex(Photos).first().where('id', id);
  return await query;
}

export async function getLabels(photoId) {
  if (!photoId) {
    throw new Error('retrieving a photo requires an id');
  }
  const knex = getConn();
  const query = knex(Photos)
    .join(PhotoLabels, 'photoLabels.photo', 'photos.id')
    .join(Labels, 'labels.id', 'photoLabels.label')
    .where('photos.id', photoId);
  return await query;
}

export async function create(photo) {
  if (!(photo.file_type && photo.name && photo.data)) {
    throw new Error('Photo requires fields: file_type, name, & data');
  }
  const imageData = photo.data.replace(/^data:\w+\/\w+;base64,/, "");
  const imagePath = await writePhoto(`${photo.name}.${photo.file_type}`, imageData);
  const knex = getConn();
  const newPhoto = {
    id: getUuid(),
    name: photo.name,
    file_type: photo.file_type,
    location: imagePath
  };
  const query = knex(Photos).insert(newPhoto);
  const result = await query;
  if (photo.label) {
    const labelRelation = { photo: newPhoto.id, label: photo.label };
    const labelAdded = await PhotoLabelService.create(labelRelation);
  }
  return photo;
}

export async function deletePhoto(photo) {
  if (!photo.id) {
    throw new Error('No Photo id given to delete');
  }
  const photoId = photo.id;
  const knex = getConn();
  const query = knex(Photos)
    .del()
    .where('id', photoId);
  const result = await query;
  await PhotoLabelService.removeAllWithPhoto(photoId);
  return ({ deleted: result === 1 });
}
