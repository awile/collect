
import { PhotoLabelService } from '../services/';

export async function handlePhotoLabelReequest(event, request) {
  const { url, body, responseChannel } = request;
  let response = { status: 'bad request' };
  if (url === 'CREATE') {
    response = await PhotoLabelService.create(body);
  } else if (url === 'GET') {
    response = await PhotoLabelService.get(body);
  } else if (url === 'DELETE') {
    response = await PhotoLabelService.deletePhotoLabel(body);
  } else if (url === 'CREATE_BULK') {
    response = await PhotoLabelService.createBulk(body);
  }
  event.reply(responseChannel, response);
}
