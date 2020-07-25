
import { PhotoService } from '../services/';

export async function handlePhotoRequests(event, request) {
  const { url, body, responseChannel } = request;
  if (url === 'SEARCH') {
    const photos = await PhotoService.search(body || {});
    event.reply(responseChannel, photos);
  } else if (url === 'CREATE') {
    const result = await PhotoService.create(body);
    event.reply(responseChannel, result);
  } else if (url === 'DELETE') {
    const result = await PhotoService.deletePhoto(body);
    event.reply(responseChannel, result);
  }
}
