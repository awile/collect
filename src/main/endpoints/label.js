
import { LabelService } from '../services/';

export async function handleLabelRequests(event, request) {
  const { url, body, responseChannel } = request;
  if (url === 'SEARCH') {
    const labels = await LabelService.search(body || {});
    event.reply(responseChannel, labels);
  }
}
