const form = document.querySelector('#access');
const codeInput = document.querySelector('#code');
const status = document.querySelector('#status');
const requestList = document.querySelector('#requests');

function renderRequest(item) {
  const card = document.createElement('article');
  card.className = 'request';
  card.innerHTML = `<div><strong>${item.name}</strong><small>${item.type === 'video' ? 'Video call' : 'Live chat'} · ${new Date(item.createdAt).toLocaleString()}</small></div>`;
  const button = document.createElement('button');
  button.textContent = item.status === 'accepted' ? 'Accepted' : 'Accept';
  button.disabled = item.status === 'accepted';
  button.addEventListener('click', async () => {
    const response = await fetch(`/api/live-support/accept/${item.id}`, {
      method: 'POST',
      headers: { 'x-live-support-code': codeInput.value },
    });
    const result = await response.json();
    if (!response.ok) {
      status.textContent = result.error || 'Could not accept request.';
      return;
    }
    item.status = result.request.status;
    if (result.request.room?.url)
      window.open(result.request.room.url, '_blank', 'noopener,noreferrer');
    button.textContent = result.request.room?.url ? 'Room opened' : 'Accepted';
    button.disabled = true;
    status.textContent = result.request.room?.url
      ? 'Daily room opened.'
      : 'Request accepted. Add DAILY_API_KEY to create video rooms.';
  });
  card.append(button);
  requestList.prepend(card);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  requestList.replaceChildren();
  const stream = new EventSource(
    `/api/live-support/stream?code=${encodeURIComponent(codeInput.value)}`,
  );
  stream.onopen = () => {
    form.hidden = true;
    requestList.hidden = false;
    status.textContent = 'Listening for visitors...';
  };
  stream.onmessage = (event) => renderRequest(JSON.parse(event.data));
  stream.onerror = () => {
    stream.close();
    form.hidden = false;
    status.textContent = 'Connection closed. Check the access code and server.';
  };
});
