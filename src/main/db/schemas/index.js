
import { setupPhotosTable } from './photos';
import { setupLabelsTable } from './labels';
import { setupPhotoLabelsTable } from './photoLabels';

const TABLE_SETUP_FUNCTIONS = [
  setupPhotosTable,
  setupLabelsTable,
  setupPhotoLabelsTable
];

export async function setupDBTables(knex) {
  console.log('setting up tables');
 await Promise.all(
    TABLE_SETUP_FUNCTIONS.map(setupFunc => setupFunc(knex))
  );
  console.log('created tables');
}
