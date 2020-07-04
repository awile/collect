
import { PhotoService } from '../services/';

export async function handlePhotoRequests(event, args) {
  const [endpoint, params, responseChannel] = args;
  if (endpoint === 'SEARCH') {
    const photos = await PhotoService.search(params || {});
    event.reply(responseChannel, photos);
  }
}
