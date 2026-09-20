import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const port = Number(process.env.LIVE_SUPPORT_PORT || 8787);
const accessCode = process.env.LIVE_SUPPORT_CODE || 'deaf-safaris-local';
const dailyApiKey = process.env.DAILY_API_KEY;
const requests = [];
const listeners = new Set();

function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

function broadcast(request) {
  const payload = `data: ${JSON.stringify(request)}\n\n`;
  listeners.forEach((response) => response.write(payload));
}

async function createDailyRoom() {
  if (!dailyApiKey) return null;
  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${dailyApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties: { exp: Math.floor(Date.now() / 1000) + 3600 } }),
  });
  if (!response.ok) throw new Error(`Daily room creation failed: ${response.status}`);
  return response.json();
}

async function requestBody(request) {
  let body = '';
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === 'GET' && request.url === '/staff.html') {
      const html = await readFile(join(process.cwd(), 'public', 'staff.html'));
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(html);
      return;
    }
    if (request.method === 'GET' && request.url === '/staff.js') {
      const script = await readFile(join(process.cwd(), 'public', 'staff.js'));
      response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
      response.end(script);
      return;
    }
    if (request.method === 'POST' && request.url === '/api/live-support/requests') {
      const body = await requestBody(request);
      if (!body.name || !['chat', 'video'].includes(body.type)) {
        json(response, 400, { error: 'Name and a valid support type are required.' });
        return;
      }
      const item = {
        id: randomUUID(),
        name: String(body.name).slice(0, 80),
        type: body.type,
        createdAt: new Date().toISOString(),
        status: 'waiting',
      };
      requests.unshift(item);
      broadcast(item);
      json(response, 201, { request: item, configured: Boolean(dailyApiKey) });
      return;
    }
    if (
      request.method === 'GET' &&
      request.url.startsWith('/api/live-support/stream')
    ) {
      if (
        new URL(request.url, `http://${request.headers.host}`).searchParams.get(
          'code',
        ) !== accessCode
      ) {
        json(response, 401, { error: 'Invalid staff access code.' });
        return;
      }
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      requests.forEach((item) => response.write(`data: ${JSON.stringify(item)}\n\n`));
      listeners.add(response);
      request.on('close', () => listeners.delete(response));
      return;
    }
    if (
      request.method === 'POST' &&
      request.url.startsWith('/api/live-support/accept/')
    ) {
      const code = request.headers['x-live-support-code'];
      if (code !== accessCode) {
        json(response, 401, { error: 'Invalid staff access code.' });
        return;
      }
      const item = requests.find((entry) => entry.id === request.url.split('/').pop());
      if (!item) {
        json(response, 404, { error: 'Request not found.' });
        return;
      }
      item.status = 'accepted';
      if (item.type === 'video') {
        try {
          item.room = await createDailyRoom();
        } catch (error) {
          json(response, 502, { error: error.message });
          return;
        }
      }
      broadcast(item);
      json(response, 200, { request: item, dailyConfigured: Boolean(dailyApiKey) });
      return;
    }
    json(response, 404, { error: 'Not found.' });
  } catch (error) {
    json(response, 500, { error: error.message });
  }
});

server.listen(port, () => console.log(`Live support server: http://127.0.0.1:${port}`));
