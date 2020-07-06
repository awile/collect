
import { LabelService } from '../services/';

export async function handleLabelRequests(event, request) {
  const { url, body, responseChannel } = request;
  let response = { status: 'bad request' };
  if (url === 'SEARCH') {
    response = await LabelService.search(body || {});
  } else if (url === 'CREATE') {
    response = await LabelService.create(body);
  } else if (url === 'UPDATE') {
    response = await LabelService.update(body);
  } else if (url === 'DELETE') {
    response = await LabelService.deleteLabel(body.id);
  }
  event.reply(responseChannel, response);
}
