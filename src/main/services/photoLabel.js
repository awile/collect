
import { getConn, getUuid, PhotoLabels } from '../db/';
import * as LabelService from './label';
import * as PhotoService from './photo';

export async function create(labelRelation) {
  if (!(labelRelation.photo && labelRelation.label)) {
    throw new Error('Photo Label Relationship requires: a photo and label id');
  }
  const knex = getConn();
  const label = await LabelService.get(labelRelation.label);
  if (!label) {
    throw new Error(`no label found with id ${labelRelation.label}`);
  }

  const photo = await PhotoService.get(labelRelation.photo);
  if (!photo) {
    throw new Error(`no photo found with id ${labelRelation.photo}`);
  }
  const newPhotoLabelRelation = {
    id: getUuid(),
    label: label.id,
    photo: photo.id
  };
  await knex(PhotoLabels).insert(newPhotoLabelRelation);
  return newPhotoLabelRelation;
}

export async function get(body) {
  if (!body.photoId) {
    throw new Error('No photoId found to query label relations');
  }
  const { photoId, size, offset } = body;
  const querySize = size || 10;
  const queryOffset = offset || 0;
  const knex = getConn();
  const query = knex(PhotoLabels)
    .select()
    .where('photo', photoId)
    .offset(queryOffset)
    .limit(querySize);
  return await query;
}

export async function deletePhotoLabel(body) {
  if (!body.photo || !body.label) {
    throw new Error('photo id and label id required to remove');
  }
  const { photo, label } = body;
  const knex = getConn();
  const query = knex(PhotoLabels)
    .del()
    .where('photo', photo)
    .andWhere('label', label)
  return await query;
}
