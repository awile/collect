
import { getConn } from '../db/';
import { getUuid } from '../db/utils';
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
  await knex('photoLabels').insert(newPhotoLabelRelation);
  return newPhotoLabelRelation;
}
