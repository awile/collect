
import { LabelService } from '../services/';

export async function handleLabelRequests(event, request) {
  const { url, body, responseChannel } = request;
  if (url === 'SEARCH') {
    const labels = await LabelService.search(body || {});
    event.reply(responseChannel, labels);
  } else if (url === 'CREATE') {
    const label = await LabelService.create(body);
    event.reply(responseChannel, label);
  }
}
