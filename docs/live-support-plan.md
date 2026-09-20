# Live support plan

## Agreed experience

Deaf Safaris should let visitors request live support through:

- Live text chat.
- Live video calls for sign-language communication.
- A waiting state while a team member is available.
- A staff view that receives incoming requests and accepts or declines them.
- Text chat during a video call.
- Keyboard-accessible controls, captions where supported, camera/microphone permissions, and clear connection states.

## Recommended implementation

Use a managed real-time video provider such as Daily for the first production version. The provider should supply browser video rooms, participant state, and a data channel or paired chat service. A small backend is still required for visitor requests, staff authentication, room creation, short-lived access tokens, availability, and notifications.

## Required production pieces

1. Visitor-facing live support buttons and waiting screen.
2. Staff dashboard with availability and incoming requests.
3. Backend endpoint to create a private room and issue time-limited participant access.
4. Video, microphone, captions, text chat, and leave-call controls.
5. Request timeout, reconnect, decline, and fallback-to-email states.
6. Privacy notice and consent before camera or microphone access.

## Current boundary

The local prototype now includes a Node request server, a shared-code staff dashboard, an SSE request queue, visitor live-chat/video request controls, and a Daily-ready room creation endpoint. Run `npm run live-support` beside Vite, then open `http://127.0.0.1:8787/staff.html` with the `LIVE_SUPPORT_CODE` value. The default code is for local testing only and must be replaced.

Video rooms are not active until `DAILY_API_KEY` is added from `.env.example`. The server currently keeps requests in memory, so production still needs hosted deployment, persistent storage, staff authentication, privacy controls, and monitoring. Do not treat the local shared-code dashboard as production security.
