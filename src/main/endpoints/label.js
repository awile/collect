
import { LabelService } from '../services/';

export async function handleLabelRequests(event, args) {
  const [endpoint, params, responseChannel] = args;
  if (endpoint === 'SEARCH') {
    const labels = await LabelService.search(params || {});
    event.reply(responseChannel, labels);
  }
}
